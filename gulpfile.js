var gulp = require('gulp');
var sass = require('gulp-sass');
//var browserSync = require('browser-sync').create();
var connect = require('gulp-connect')
//var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var autoPrefixer = require('gulp-autoprefixer');
var imagemin = require("gulp-imagemin");


var browserToFix = [
    '> 1%',
    'ie >= 8',
    'edge >= 15',
    'ie_mob >= 10',
    'ff >= 45',
    'chrome >= 45',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];

// Variables de recursos CSS, JS HTML

sass.compiler = require('node-sass');

var styleSRC =  './src/scss/*.scss';  // en esta variable guardamos todos recursos los estilo ./src/scss
var styleURL =  './app/css/'; //En esta variable se almacena la ruta al archivo css de la ./app

var fontsSRC = './src/fonts/**/*.*';
var fontsURL = './app/fonts/' ;


var jsSRC = './src/js/main.js';  // en esta variable guardamos todos los recursos estilo JS
var jsURL = './app/js/';

var htmlSRC = './src/**/*.html'; // en esta variable guardamos todos los recursos HTML contenido en la ruta especificada 
var htmlURL = './app/';

var imgSRC = './src/img/**/*.*';
var imgURL = './app/img/';

var styleWatch = './src/scss/**/*.scss'
var jsWatch = './src/js/**/*.js';
var htmlWatch = './src/**/*.html';
var fontsWatch = './src/fonts/**/*.*';
var imgWatch = './src/img/**/*.*';


var mapURL = './';


function triggerPlumber(src, url){
    return gulp.src(src)
        .pipe(plumber())
        .pipe(gulp.dest(url))
}



// compliamos los archivos scss en los archivos css de nuestra app


gulp.task('js',async ()=>{
    // Esta función nos genera en la dirección especificada en la variable "jsURL",
    // el archivo indicado en la carptea en la variable "jsSRC"


    //return triggerPlumber(jsSRC,jsURL);    // esta es otra manera de hacer lo mismo que con la lineas de abajo pero no se aún en qué se diferencian

    
    gulp.src(jsSRC)
        .pipe(sourcemaps.init())
        .pipe(rename({suffix:'.min'} ))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(jsURL))
        .on('error',console.log.bind(console))
        //.pipe(browserSync.stream())
    ;     
});

gulp.task('css', async ()=>{
    // Esta taréa carga en los archivos de estilo "css" de la carptea "app" todo los cambios realizados en el scss/app.scss
    gulp.src(styleSRC)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole:  true,
            outputStyle:"compressed" // este atributo de la funcion sass nos minifica el archivo 
        })
        .on('error',sass.logError))
        .pipe(autoPrefixer({
            browse:browserToFix,
            cascade: false
        }))
        .pipe(rename({suffix: '.min'})) // en esta linea indicamos que cuando se transfiera el archivo desde src hacia app se 
                                        //transferirá con el nombre del archivo como tal con contrar la extenión tterminando en ".min"
                                        // pero NO minifica el archo (esto se hace con el atributo "outputStyle:'compressed')" de la funcion sass
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(styleURL)).on('error',console.log.bind(console))
        //.pipe(browserSync.stream())

});

    
gulp.task('fonts', async ()=>{
    gulp.src(fontsSRC)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole:true,
            outputStyle:"compressed"
        })
        .on('error',sass.logError))        
        .pipe(rename({suffix:'.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(fontsURL))
        .on('error',console.log.bind(console))
    //return triggerPlumber(fontsSRC, fontsURL);
        
});
gulp.task("img", async()=>{
    gulp.src(imgSRC)            
    .pipe(imagemin({
        progessive: true,
        interlaced: true
    }))
    .pipe(gulp.dest(imgURL))
    .pipe(notify({message: "Imagemin task finalizada"}))
});

gulp.task('html', async ()=>{
    return triggerPlumber(htmlSRC,htmlURL);
});

gulp.task('serve',async ()=>{
    //  esta gulp task:"serve" ejecuta la función "sass"  antes que todo
    console.log ("entro en serve");
    connect.server({
        root:'./app/',
        port:8081,
        livereload:true           
    });
       
});

gulp.task('watchFiles', async ()=>{
    gulp.watch(styleWatch, gulp.series( 'css'));
    gulp.watch(htmlWatch,gulp.series('html'));
    gulp.watch(imgWatch, gulp.series('img'));
    gulp.watch(fontsWatch, gulp.series('fonts'));
    gulp.watch(jsWatch, gulp.series('js'));
    gulp.src(jsURL+'main.min.js',connect.reload())
        .pipe(notify({message:'gulp is watching, happy conding'}))    
        
}); 

gulp.task('build',gulp.parallel('css','js','html', 'fonts', 'img'))

gulp.task('default', gulp.series('build','serve','watchFiles' )); 



