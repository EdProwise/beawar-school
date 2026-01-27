
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class MongoDBQueryBuilder {
  private table: string;
  private params: URLSearchParams;
  private method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'UPSERT' = 'GET';
  private body: any = null;

  constructor(table: string) {
    this.table = table;
    this.params = new URLSearchParams();
  }

  select(columns: string = '*', { count }: { count?: 'exact' } = {}) {
    if (columns !== '*') {
      this.params.set('select', columns);
    }
    if (count) {
      this.params.set('count', count);
    }
    return this;
  }

  eq(field: string, value: any) {
    this.params.set(field, value);
    return this;
  }

  neq(field: string, value: any) {
    this.params.set(`${field}_neq`, value);
    return this;
  }

  gte(field: string, value: any) {
    this.params.set(`${field}_gte`, value);
    return this;
  }

  lte(field: string, value: any) {
    this.params.set(`${field}_lte`, value);
    return this;
  }

  in(field: string, values: any[]) {
    this.params.set(`${field}_in`, JSON.stringify(values));
    return this;
  }

  order(field: string, { ascending = true } = {}) {
    this.params.set('sort', field);
    this.params.set('order', ascending ? 'asc' : 'desc');
    return this;
  }

  limit(count: number) {
    this.params.set('limit', count.toString());
    return this;
  }

  async then(onfulfilled?: (value: any) => any) {
    try {
      let response;
      let url = new URL(`${API_URL}/${this.table}`);
      this.params.forEach((value, key) => url.searchParams.append(key, value));

      if (this.method === 'GET') {
        response = await fetch(url.toString());
      } else if (this.method === 'POST') {
        response = await fetch(url.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Array.isArray(this.body) ? this.body[0] : this.body),
        });
      } else if (this.method === 'PATCH' || this.method === 'DELETE') {
        const reservedParams = ['select', 'count', 'sort', 'order', 'limit', 'head'];
        const field = Array.from(this.params.keys()).find(k => !k.includes('_') && !reservedParams.includes(k));
        const value = field ? this.params.get(field) : null;

        if (!value && this.method === 'PATCH') {
          return onfulfilled ? onfulfilled({ data: null, error: { message: 'Update requires an eq() filter (usually id)' } }) : { data: null, error: { message: 'Update requires an eq() filter (usually id)' } };
        }
        
        // For DELETE, if no ID is provided but we have other filters (like 'in'), we handle it differently
        // But for simplicity with our current server, we expect an ID or handle bulk deletes differently.
        // Let's support bulk delete if 'in' is present.
        const inFilter = Array.from(this.params.keys()).find(k => k.endsWith('_in'));
        
        if (this.method === 'DELETE' && !value && inFilter) {
           // Bulk delete via query params
           response = await fetch(url.toString(), { method: 'DELETE' });
        } else {
           const idUrl = value ? `${API_URL}/${this.table}/${value}` : url.toString();
           response = await fetch(idUrl, {
             method: this.method,
             headers: this.method === 'PATCH' ? { 'Content-Type': 'application/json' } : {},
             body: this.method === 'PATCH' ? JSON.stringify(this.body) : undefined,
           });
        }
      } else if (this.method === 'UPSERT') {
        response = await fetch(`${API_URL}/${this.table}/upsert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: this.body }),
        });
      } else {
        throw new Error(`Unsupported method: ${this.method}`);
      }

      let data = await response.json();
      
      // Map _id to id for consistency with Supabase/Frontend expectations
      const mapId = (obj: any) => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(mapId);
        
        const newObj = { ...obj };
        if (newObj._id && !newObj.id) {
          newObj.id = newObj._id.toString();
        }
        return newObj;
      };

      data = mapId(data);
      
      let result;
      if (this.params.get('head') === 'true') {
        result = { count: data.count, error: response.ok ? null : { message: data.error } };
      } else if (this.params.get('count') === 'exact') {
        result = { data: data.data, count: data.count, error: response.ok ? null : { message: data.error } };
      } else {
        result = { data, error: response.ok ? null : { message: data.error } };
      }
      
      return onfulfilled ? onfulfilled(result) : result;
    } catch (error: any) {
      const result = { data: null, error: { message: error.message } };
      return onfulfilled ? onfulfilled(result) : result;
    }
  }

  // To support await
  async maybeSingle() {
    const { data, error } = await this;
    const result = Array.isArray(data) ? (data.length > 0 ? data[0] : null) : (data || null);
    return { data: result, error };
  }

  async single() {
    const { data, error } = await this;
    if (error) return { data: null, error };
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return { data: null, error: { message: 'No rows found' } };
    }
    const result = Array.isArray(data) ? data[0] : data;
    return { data: result || null, error: null };
  }

  insert(values: any | any[]) {
    this.method = 'POST';
    this.body = values;
    return this;
  }

  update(values: any) {
    this.method = 'PATCH';
    // Remove id and _id from body to avoid MongoDB update errors
    const { id, _id, ...rest } = values;
    this.body = rest;
    return this;
  }

  delete() {
    this.method = 'DELETE';
    return this;
  }

  upsert(values: any) {
    this.method = 'UPSERT';
    this.body = values;
    return this;
  }
}

export const mongodb = {
  from: (table: string) => new MongoDBQueryBuilder(table),
  auth: {
    // Basic session management
    getSession: async () => {
      const session = localStorage.getItem('school_session');
      return { data: { session: session ? JSON.parse(session) : null }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      const handleStorageChange = () => {
        const session = localStorage.getItem('school_session');
        callback('SIGNED_IN', session ? JSON.parse(session) : null);
      };
      window.addEventListener('storage', handleStorageChange);
      
      // Initial trigger
      const session = localStorage.getItem('school_session');
      if (session) {
        setTimeout(() => callback('SIGNED_IN', JSON.parse(session)), 0);
      }
      
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handleStorageChange) } } };
    },
    signInWithPassword: async ({ email, password }: any) => {
      try {
        const response = await fetch(`${API_URL.replace('/api', '')}/api/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        
        localStorage.setItem('school_session', JSON.stringify(data.session));
        // Manually trigger storage event for current tab
        window.dispatchEvent(new Event('storage'));
        
        return { data, error: null };
      } catch (error: any) {
        return { data: { user: null, session: null }, error: { message: error.message } };
      }
    },
    signUp: async ({ email, password, options }: any) => {
      try {
        const response = await fetch(`${API_URL.replace('/api', '')}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, data: options?.data }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        
        localStorage.setItem('school_session', JSON.stringify(data.session));
        window.dispatchEvent(new Event('storage'));
        
        return { data, error: null };
      } catch (error: any) {
        return { data: { user: null, session: null }, error: { message: error.message } };
      }
    },
    signOut: async () => {
      localStorage.removeItem('school_session');
      window.dispatchEvent(new Event('storage'));
      return { error: null };
    },
  },
    storage: {
      from: (bucket: string) => ({
          upload: async (path: string, file: File) => {
            try {
              const formData = new FormData();
              formData.append('path', path);
              formData.append('file', file);

              const response = await fetch(`${API_URL.replace('/api', '')}/api/storage/upload`, {
                method: 'POST',
                body: formData,
              });
              
              const contentType = response.headers.get("content-type");
              if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Upload failed');
                return { data: { path: data.data.path }, error: null };
              } else {
                const text = await response.text();
                throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
              }
            } catch (error: any) {
              return { data: null, error: { message: error.message } };
            }
          },
          getPublicUrl: (path: string) => {
            const baseUrl = API_URL.replace('/api', '');
            return { data: { publicUrl: `${baseUrl}/uploads/${path}` } };
          },
          remove: async (paths: string[]) => {
            try {
              const response = await fetch(`${API_URL.replace('/api', '')}/api/storage/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paths }),
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.error);
              return { data, error: null };
            } catch (error: any) {
              return { data: null, error: { message: error.message } };
            }
          }
        })
      }

};

export const supabase = mongodb;
