var currentPage = 1
function Pageload(a){
    currentPage = a
    $.ajax({
        url:'/list?page='+a,
        type:'GET'
    })
    .then(data=>{
        $('#content').html('')
        console.log(data.result.length)
        for (let i = 0; i < data.result.length; i++) {
            const element = data.result[i];
            var item=$(`
            <h1>${element.Name}:${element.Password}</h1>
            `)
            $('#content').append(item)
        }
    })
    .catch(err=>{
        console.log(err)
    })
} 
function Next(){
    currentPage++
    $.ajax({
        url:'/list?page='+currentPage,
        type:'GET'
    })
    .then(data=>{
        $('#content').html('')
        console.log(data.result.length)
        for (let i = 0; i < data.result.length; i++) {
            const element = data.result[i];
            var item=$(`
            <h1>${element.Name}:${element.Password}</h1>
            `)
            $('#content').append(item)
        }
    })
    .catch(err=>{
        console.log(err)
    })
} 
function Previous(){
    currentPage--
    if(currentPage<1)
    {$('#content').append(Pageload(1))}
    else{
        $.ajax({
        url:'/list?page='+currentPage,
        type:'GET'
    })
    .then(data=>{
        $('#content').html('')
        console.log(data.result.length)
        for (let i = 0; i < data.result.length; i++) {
            const element = data.result[i];
            var item=$(`
            <h1>${element.Name}:${element.Password}</h1>
            `)
            $('#content').append(item)
        }
    })
    .catch(err=>{
        console.log(err)
    })}
}