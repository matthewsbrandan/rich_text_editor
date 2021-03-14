// 'https://images6.alphacoders.com/754/thumb-350-754631.jpg'
let planets = [];
textField.document.designMode = "On";
let show;

function toggleSection(param){
    $('.nav-link').removeClass('active');
    $('#to-'+param).addClass('active');
    $('section').hide();
    $('#'+param).show('slow');
    $('article').removeClass('main-article');

    if(param=='section-article'){
        $('#section-article .main-title .text-light-gradient').html('New');
        $('#section-article .main-title .title-target').html('Planets');
        $('#id').val(null);
        $('#name').focus();
    }
}
function openArticle(elem){
    $('article').removeClass('main-article');
    elem.children('.article-body').hide();
    setTimeout(function(){
        elem.addClass('main-article');
        elem.children('.article-body').show('slow');
        window.scroll(0,elem.offset().top - 28);
    },100);
}
function addTool(elem){
    textField.focus();
    let cmd = elem.attr('data-cmd');
    if(cmd === 'showCode'){
        elem.toggleClass('active');
    }
    if(cmd === 'insertImage' || cmd === 'createLink'){
        let url = prompt("Enter link here: ", "");
        textField.document.execCommand(cmd, false, url);
        if(cmd === 'insertImage'){
            const images = textField.document.querySelectorAll('img');
            images.forEach(image =>{
                image.style.maxWidth = "25rem";
                image.style.borderRadius = "5px";
            });
        }else{
            const links = textField.document.querySelectorAll('a');
            links.forEach(link =>{
                link.target = "_blank";
                link.addEventListener('mouseover',()=>{ textField.document.designMode = "Off"; });
                link.addEventListener('mouseout',()=>{ textField.document.designMode = "On"; });
            });
        }
    }else{
        textField.document.execCommand(cmd, false, null);
    }
    if(cmd === "showCode"){
        const textBody = textField.document.querySelector('body');
        if(show){
            textBody.innerHTML = textBody.textContent;
            show = false;
        }else{
            textBody.textContent = textBody.innerHTML;
            show = true;
        }
    }
    textField.focus();
}
function sendArticle(){
    id = $('#id').val();
    const textBody = textField.document.querySelector('body');
    if(id === null){
        id = planets.length;
        planet = {
            'created_at': longDate(),
            'name': $('#name').val().toUpperCase(),
            'km': $('#km').val(),
            'image': $('#image').val(),
            'text': '',
        };
        planets.push(planet);
        html ="<article id='article-"+id+"' onclick='openArticle($(this))'></article>";   
        $('.content-articles').append(html);
    }
    planets[id].text = textBody.innerHTML;
    resetForm(textBody);

    $('#to-section-home a').click();
    $('#article-'+id).html(articleInnerHTML(planets[id],id,true)).click();
}
function openEdition(id){
    const textBody = textField.document.querySelector('body');

    $('#section-edition').hide();
    $('#section-article .main-title .text-light-gradient').html('Edit');
    $('#section-article .main-title .title-target').html(toFirstCharUpperCase(planets[id].name));
    $('#section-article').show();

    $('#id').val(id);
    $('#name').val(planets[id].name);
    $('#km').val(planets[id].km);
    $('#image').val(planets[id].image);
    textBody.innerHTML = planets[id].text;
}
function resetForm(textBody){
    textBody.innerHTML = "";
    $('#name').val('');
    $('#km').val('');
    $('#image').val('');
}
function loadArticles(){
    html ="";
    list =""; 
    planets.forEach((planet,index) => {
        html+= articleInnerHTML(planet,index);
        list+="<div class='planet-item list-item-"+index+"' onclick='openEdition("+index+")'>";
        list+="<h3>"+planet.name+"</h3>";
        list+="<span>"+planet.created_at+"</span>";
        list+="</div>";
    });
    $('.content-articles').html(html);
    $('.list-planets').html(list);
}
function articleInnerHTML(planet,index,withoutTagArticle=false){
    html ="";
    if(!withoutTagArticle) html+="<article id='article-"+index+"' onclick='openArticle($(this))'>";
    html+="<div class='wrapper-image'>";
    html+="<img src='"+planet.image+"'>";
    html+="</div>";
    html+="<div class='article-body'>";
    html+="<span class='article-created-at'>"+planet.created_at+"</span>";
    html+="<h2 class='article-title'>"+planet.name+"</h2>";
    html+="<p class='article-subtitle'>"+planet.km+" km</p>";
    html+="<div class='article-text'>";
    html+=planet.text;
    html+="</div>";
    html+="</div>";
    if(!withoutTagArticle) html+="</article>";
    return html;
}
function storePlanets(){
    $('#textareaClipboard').val(JSON.stringify(planets));
    $('#modalConvertToJSON').addClass('modal-open');
}
function copyToClipboard(){
    $('#textareaClipboard').select();
    document.execCommand('copy');
    $('.alert-clipboard').show('slow');
    setTimeout(()=>$('.alert-clipboard').hide('slow'),2000);
}

// UTILITIES =================================================
function longDate(){
    date = new Date();
    day = date.getDate();
    month = date.getMonth();
    year = date.getFullYear();

    month_name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return month_name[month]+' '+day+', '+year;
}
function toFirstCharUpperCase(str){
    str = str.toLowerCase();

    arrStr = str.split(' ');
    arrStr = arrStr.map(word => {
        return word = word.substring(0,1).toUpperCase().concat(word.substring(1));
    });

    return arrStr.join(' ');
}
// ONLOAD ====================================================
$(function(){
    $.getJSON( "planets.json", function( data ) {
        planets = data;
        loadArticles();
    });
    $('.nav-link:nth-child(1) a').click();
    document.getElementById("article-editable").contentDocument.body.style.fontFamily = "'Roboto', sans-serif";
    document.getElementById("article-editable").contentDocument.body.style.color = "#84858a";
});