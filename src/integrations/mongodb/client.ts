
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class MongoDBQueryBuilder {
  private table: string;
  private params: URLSearchParams;

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
    const url = new URL(`${API_URL}/${this.table}`);
    this.params.forEach((value, key) => url.searchParams.append(key, value));
    
    try {
      const response = await fetch(url.toString());
      const data = await response.json();
      
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

  async insert(values: any | any[]) {
    const response = await fetch(`${API_URL}/${this.table}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Array.isArray(values) ? values[0] : values),
    });
    const data = await response.json();
    return { data, error: response.ok ? null : { message: data.error } };
  }

  async update(values: any) {
    const reservedParams = ['select', 'count', 'sort', 'order', 'limit', 'head'];
    const field = Array.from(this.params.keys()).find(k => !k.includes('_') && !reservedParams.includes(k));
    const value = field ? this.params.get(field) : null;
    
    if (!value) {
       return { data: null, error: { message: 'Update requires an eq() filter (usually id)' } };
    }

    const response = await fetch(`${API_URL}/${this.table}/${value}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    return { data, error: response.ok ? null : { message: data.error } };
  }

  async delete() {
    const reservedParams = ['select', 'count', 'sort', 'order', 'limit', 'head'];
    const field = Array.from(this.params.keys()).find(k => !k.includes('_') && !reservedParams.includes(k));
    const value = field ? this.params.get(field) : null;
    
    if (!value) {
       return { data: null, error: { message: 'Delete requires an eq() filter (usually id)' } };
    }

    const response = await fetch(`${API_URL}/${this.table}/${value}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return { data, error: response.ok ? null : { message: data.error } };
  }

  async upsert(values: any) {
    const response = await fetch(`${API_URL}/${this.table}/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: values }),
    });
    const data = await response.json();
    return { data, error: response.ok ? null : { message: data.error } };
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
            formData.append('file', file);
            formData.append('path', path);

            const response = await fetch(`${API_URL.replace('/api', '')}/api/storage/upload`, {
              method: 'POST',
              body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            return { data: { path: data.data.path }, error: null };
          } catch (error: any) {
            return { data: null, error: { message: error.message } };
          }
        },
        getPublicUrl: (path: string) => {
          const baseUrl = API_URL.replace('/api', '');
          return { data: { publicUrl: `${baseUrl}/uploads/${path}` } };
        },
      })
    }

};

export const supabase = mongodb;
