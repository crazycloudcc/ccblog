/** Small, exact teaching domain. Public indices are one-based. */
export function lowbit(i: number) {
  if (!Number.isInteger(i) || i < 1 || i > 16) throw new RangeError('Index 1–16 required');
  return i & -i;
}
export function fenwickModel(values: readonly number[], mode: 'query' | 'update', index: number, delta = 0) {
  if (!Array.isArray(values) || values.length < 1 || values.length > 16 || Array.from(values).some(v => !Number.isInteger(v) || Math.abs(v) > 99)) throw new RangeError('Use 1–16 integers from -99 to 99');
  if (mode !== 'query' && mode !== 'update') throw new RangeError('Unknown mode');
  if (!Number.isInteger(index) || index < (mode === 'query' ? 0 : 1) || index > values.length || !Number.isInteger(delta) || Math.abs(delta) > 99) throw new RangeError('Invalid index or delta');
  const bit = [0, ...values.map((_, i) => values.slice(i + 1 - lowbit(i + 1), i + 1).reduce((a,b) => a+b,0))];
  const path: number[] = [];
  for (let i=index; i>0 && i<=values.length; i += mode === 'query' ? -lowbit(i) : lowbit(i)) path.push(i);
  const after = [...values]; if (mode === 'update') after[index-1] += delta;
  return { values:[...values],bit,path,after,sum:mode === 'query' ? path.reduce((s,i)=>s+bit[i],0) : undefined, ranges:values.map((_, i)=>({i:i+1,l:i+2-lowbit(i+1),r:i+1})) };
}
export const fenwickValues = [3,-2,4,1,5,-3,2,6] as const;
