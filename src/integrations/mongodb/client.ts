
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class MongoDBQueryBuilder {
  private table: string;
  private params: URLSearchParams;

  constructor(table: string) {
    this.table = table;
    this.params = new URLSearchParams();
  }

  select(columns: string = '*') {
    if (columns !== '*') {
      this.params.set('select', columns);
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
      const result = { data, error: response.ok ? null : { message: data.error } };
      return onfulfilled ? onfulfilled(result) : result;
    } catch (error: any) {
      const result = { data: null, error: { message: error.message } };
      return onfulfilled ? onfulfilled(result) : result;
    }
  }

  // To support await
  async maybeSingle() {
    const { data, error } = await this;
    return { data: Array.isArray(data) ? data[0] : data, error };
  }

  async single() {
    const { data, error } = await this;
    if (error) return { data: null, error };
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return { data: null, error: { message: 'No rows found' } };
    }
    return { data: Array.isArray(data) ? data[0] : data, error: null };
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
    const field = Array.from(this.params.keys()).find(k => !k.includes('_'));
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
    const field = Array.from(this.params.keys()).find(k => !k.includes('_'));
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
    // Basic session mock for compatibility
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Auth migration pending' } }),
    signUp: async () => ({ data: { user: null }, error: { message: 'Auth migration pending' } }),
    signOut: async () => ({ error: null }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => ({ data: { path }, error: { message: 'Storage migration pending. Please use Supabase storage or implement local storage.' } }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://placeholder.com/${path}` } }),
    })
  }
};
