 var dict = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9';

 var dictTable = dict.split(',');

 var link = '';

 function dwz(id) {
     var value = [];
     while (id > 0) {
         var i = id % 62;
         value.push(i);
         id = parseInt(id / 62);
     }
     value.reverse();
     while (value.length < 6) {
         value.unshift(0);
     };
     return value;
 }

 function convertToLink(id) {
     var value = dwz(id);
     var URL = '';
     var temp = [];
     while (value.length) {

         URL += dictTable[value.shift()];
     };

     return URL;
 }
