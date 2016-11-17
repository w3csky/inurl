var dict = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9';
//数据库id起始为1，补上0号位
var dictTable = [''];
dictTable = dictTable.concat(dict.split(','));

var link = '';

//10进制转成62进制
function idEncode(dataId) {
    var value = dataId == 0 ? [0] : [];
    while (dataId > 0) {
        var i = dataId % 62;
        value.push(i);
        dataId = parseInt(dataId / 62);
    }
    value.reverse();
    return value;
}


//62进制id转成对应字符
function idToURL(id) {
    var value = idEncode(id);
    var URL = '';
    var temp = [];
    while (value.length) {
        URL += dictTable[value.shift()];
    };
    return URL;
};

function URLDecode(url) {
    //将url打散，存放打散后的字符
    var urlArray = Array.from(url);
    //存放打散后的字符对应的id
    var idArray = [];
    idArray = urlArray.map((item, key) => {
        return dictTable.indexOf(item);
    })
    var drawId = idArray.reverse();
    return drawId;
}

function URLToId(url) {
    var dataId = 0;
    var drawId = URLDecode(url);
    drawId.forEach((value, index, array) => {
        var i = Math.pow(62, index) * value;
        dataId += i;
    });
    return dataId;
}


module.exports = {
    idToURL: idToURL,
    URLToId: URLToId
}
