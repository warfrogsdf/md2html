/**
 * Created by lib7311 on 2016/10/19.
 */
var fs = require('fs');
//var showdown = require('showdown');
var exec = require('child_process').exec;

module.exports = function (rootDir) {
    var dirArr = [];
    rootDir = fs.readdirSync('./test/dir0/');
    var stack = new Array(0),
        res= [],
        currentNode = null,
        childNodeList = null;
    if(!root){
        return 'root isn`t null';
    }else{
        //将根节点入栈
        stack.push(root);
        //当栈里面节点为空循环结束
        while (stack.length){
            currentNode = stack.pop();
            res.push(currentNode);
            //将儿子节点数组反转入栈
            if(findChildList){
                childNodeList = findChildList(currentNode);
            }else{
                childNodeList = currentNode.childNodes;
            }
            stack = stack.concat(childNodeList.reverse());
        }
        return res;
    }
};

var prefix = './test/';
var distPrefix = './dist/';
var rootDir = './test/dir0' || fs.readdirSync('./test/dir0');
var stack = new Array(0),
    dirArr= [],
    currentNode = null,
    childNodeList = null;
if(!rootDir || !fs.existsSync(rootDir) || !fs.statSync(rootDir).isDirectory()){
    console.log('rootDir isn`t null or must be directory');
}else{
    //将根节点入栈
    stack.push(rootDir);
    //当栈里面节点为空循环结束
    while (stack.length){
        currentNode = stack.pop();
        dirArr.push(currentNode);
        //将儿子节点数组反转入栈
        childNodeList = fs.readdirSync(currentNode);
        console.log(childNodeList);
        /*childNodeList = childNodeList.filter(function (item, index, array) {
            if(fs.statSync(item).isDirectory()){
                array[index] = currentNode + '/' + item
            }
        });*/
        //过滤掉非文件夹的元素
        childNodeList = childNodeList.filter(function (item, index, array) {
            return fs.statSync(currentNode + '/' + item).isDirectory();
        });
        //将文件夹子节点加上父文件夹的路径
        childNodeList.forEach(function (item, index, array) {
            array[index] = currentNode + '/' + item;
        });
        stack = stack.concat(childNodeList);
    }
    dirArr.forEach(function (item, index, arr) {
        arr[index] = arr[index].substr(prefix.length);
    });
    console.log(dirArr);

    var _list_ = [];
    for(var i = 0, l = dirArr.length; i < l; ++i){
        fs.mkdirSync(distPrefix + dirArr[i]);
        _list_ = fs.readdirSync(prefix + dirArr[i]);
        //过滤掉非文件的元素
        _list_ = _list_.filter(function (item, index, array) {
            return fs.statSync(prefix + dirArr[i] + '/' + item).isFile();
        });
        //将文件夹子节点加上父文件夹的路径
        _list_.forEach(function (item, index, array) {
            array[index] = dirArr[i] + '/' + item;
        });

        for(var j = 0, z = _list_.length; j < z; ++j){

            var cmdStr = "showdown makehtml -i "+ prefix + _list_[j] +" -o "+ distPrefix + _list_[j].replace('.md', '.html') +"  Converts '"+ prefix + _list_[j] +"' to '"+ distPrefix + _list_[j].replace('.md', '.html') +"'";
            console.log(cmdStr);
            exec(cmdStr, function(err,stdout,stderr){
                if(err) {
                    console.log('showdown api error:'+stderr);
                } else {
                    console.log('showdown successful!');
                }
            });
        }
    }
    return dirArr;
}