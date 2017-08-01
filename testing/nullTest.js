var foo;

//Empty check and assignment

//check after assignment
console.log('Assignment check')
if(null != foo && 0 >= foo.length){
    console.log('foo id not null or empty!');
    foo = "something";
}

//console.log("Foo Length Now: "+foo.length);
if(null == foo && 0 >= foo.length){
    console.log("foo id null or empty!"+foo.length);
    foo = "foo";
    console.log("Foo Val now: "+foo)
}