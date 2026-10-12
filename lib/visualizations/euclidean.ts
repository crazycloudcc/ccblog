export type Square = { x:number; y:number; size:number; round:number };
export type EuclidRound = { a:number; b:number; q:number; r:number; x:number; y:number; width:number; height:number; squares:Square[] };
function valid(n:number) { return Number.isSafeInteger(n) && n >= 0; }
/** Nonnegative safe integers; gcd(0,0) is deliberately outside this lesson. */
export function euclideanTrace(a:number,b:number) {
  if(!valid(a)||!valid(b)||(a===0&&b===0)) throw new RangeError('Use nonnegative safe integers, not both zero');
  if(a<b) [a,b]=[b,a];
  const rounds:{a:number;b:number;q:number;r:number}[]=[];
  while(b!==0){const r=a%b;rounds.push({a,b,q:Math.floor(a/b),r});a=b;b=r;}
  return {gcd:a,rounds};
}
/** Bounded positive integral rectangle: exact integer coordinates, no overlap. */
export function euclideanTiling(width:number,height:number) {
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>60||height>60) throw new RangeError('Rectangle sides must be integers from 1 to 60');
  const rounds:EuclidRound[]=[];let x=0,y=0,w=width,h=height;
  while(w>0&&h>0){
    const horizontal=w>=h,a=Math.max(w,h),b=Math.min(w,h),q=Math.floor(a/b),r=a%b;
    const squares=Array.from({length:q},(_,i)=>({x:x+(horizontal?i*b:0),y:y+(horizontal?0:i*b),size:b,round:rounds.length}));
    rounds.push({a,b,q,r,x,y,width:w,height:h,squares});
    if(horizontal){x+=q*b;w=r;}else{y+=q*b;h=r;}
  }
  return {width,height,gcd:rounds.at(-1)!.b,rounds,squares:rounds.flatMap(r=>r.squares)};
}
