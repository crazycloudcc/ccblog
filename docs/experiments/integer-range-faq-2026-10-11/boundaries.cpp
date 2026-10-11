#include <algorithm>
#include <ranges>
#include <optional>
#include <cassert>
#include <vector>
#include <iostream>
using ll = long long;
template<class P> std::optional<ll> first(ll U, P enough) {
 assert(0<=U && U<=1000000000000000000LL);
 auto candidates=std::views::iota(0LL,U+1LL);
 auto it=std::ranges::partition_point(candidates,[&](ll t){assert(t>=0&&t<=U);return !enough(t);});
 if(it==candidates.end()) return std::nullopt;
 return *it;
}
bool production(ll sec, const std::vector<ll>& periods,ll target){
 ll made=0;
 for(ll k:periods){ll add=sec/k;if(add>=target-made)return true;made+=add;}
 return made>=target;
}
int main(){
 for(ll U=0;U<=100;U++)for(ll boundary=0;boundary<=U+1;boundary++){
  auto got=first(U,[&](ll t){return t>=boundary;});
  std::optional<ll> linear;
  for(ll t=0;t<=U;t++)if(t>=boundary){linear=t;break;}
  assert(got==linear);
  if(linear){ll lo=0,hi=U;while(lo<hi){ll mid=lo+(hi-lo)/2;if(mid>=boundary)hi=mid;else lo=mid+1;}assert(*got==lo);}
 }
 auto empty=std::views::iota(0LL,0LL);int calls=0;
 assert(std::ranges::partition_point(empty,[&](ll){calls++;return true;})==empty.end());assert(calls==0);
 constexpr ll U=1000000000000000000LL;
 assert(first(U,[](ll t){return t==U;})==U);
 assert(!first(U,[](ll){return false;}));assert(first(U,[](ll){return true;})==0);
 for(ll a=1;a<=12;a++)for(ll b=1;b<=12;b++)for(ll target=0;target<=24;target++){
  std::vector<ll> p{a,b};auto got=first(std::min(a,b)*target,[&](ll t){return production(t,p,target);});
  ll linear=0;while(!production(linear,p,target))linear++;assert(got==linear);
 }
 assert(first(16,[](ll t){return production(t,{2,3,7},8);})==9);
 assert(first(0,[](ll t){return production(t,{2,3,7},0);})==0);
 assert(first(U,[](ll t){return production(t,{1000000000LL},1000000000LL);})==U);
 std::cout<<"C++20: exhaustive boundaries 0..100, empty/all true/all false, 10^18, 3600 factory cases PASS\n";
}
