const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const less = require('gulp-less');
const smartgrid = require('smart-grid');
const panini = require('panini');
const purgecss = require('gulp-purgecss');
const critical = require('critical');
const terser = require('gulp-terser');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const jsImport = require('gulp-js-import');
// const babel = require('gulp-babel');



const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);




let crList = {
	'.btn': ['display', 'font-size', 'height', 'line-height', 'padding', 'text-align', 'border', 'color', 'background-color'],
	'.lang-sub': ['position', 'opacity'],
	'.menu-mob-wrap': ['display'],
};


function criticalCSS(done) {
	return critical.generate({

		base: './',
		src: 'build/index.html',
		css: ['build/assets/css/main.css'],
		target: {
			css: 'build/assets/css/critical.css',
			uncritical: 'build/assets/css/main.css'
		},
		width: 1900,
		height: 720,
		include: [], //принудительно добавляет стили
		ignore: {
			rule: [
				/:root/, /.btt/, '.menu li:after', '*', '.location:before', '.offer-section .container',
				'.offer__title span:not(:last-child):after', '.offer__title span:first-child:after', /lang-sub-/, '.menu-mob',
				'.calendarBtn', /.menu-mob li/, /@font-face/, /.icon/

			],
			decl(node, value) {
				let{ selector } = node.parent;

				if(!(selector in crList)) {
					return false;
				}
				return !crList[selector].includes(node.prop);
			}
		},
	});

}





function clear(){
	return del('build/*');
}
//
// function clearCss() {
// 	return del('build/assets*');
// }

function styles(){
	return gulp.src('./src/assets/css/main.less')
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(less())
		.pipe(gulpif(isProd, purgecss({
			content: ['src/**/*.html', 'src/assets/js/main.js', '../*.php'],
			// safelist: ['', '']
		})))
		.pipe(gulpif(isProd, gcmq()))
		.pipe(gulpif(isProd, autoprefixer({
			browsers: ['> 0.1%'],
			cascade: false
		})))
		.pipe(gulpif(isProd, cleanCSS({
			level: 2
		})))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(gulp.dest('./build/assets/css/'))
	// .pipe(gulpif(isSync, browserSync.stream()));
}

function img(){
	return gulp.src('./src/assets/img/**')
		.pipe(gulp.dest('./build/assets/img'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

function vid(){
	return gulp.src('./src/assets/video/**')
		.pipe(gulp.dest('./build/assets/video'))
		.pipe(gulpif(isSync, browserSync.stream()));
}



function html(){
	panini.refresh();
	return gulp.src('./src/*.html')
		.pipe(panini({
			root: 'src/',
			layouts: 'src/template/layouts/',
			partials: 'src/template/partials/',
			data: 'src/template/data/'
		}))
		.pipe(gulp.dest('./build'))
	// .pipe(gulpif(isSync, browserSync.stream()));
}

function icon(){
	return gulp.src('./src/assets/ico/**')
		.pipe(gulp.dest('./build/assets/ico'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

function favicon(){
	return gulp.src('./src/favicon.ico')
		.pipe(gulp.dest('./build'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

function fonts(){
	return gulp.src('./src/assets/fonts/**')
		.pipe(gulp.dest('./build/assets/fonts'))
		.pipe(gulpif(isSync, browserSync.stream()));
}
//
// function js(){
// 	return gulp.src('./src/assets/js/**')
// 		.pipe(gulp.dest('./build/assets/js'))
// 		.pipe(gulpif(isSync, browserSync.stream()));
// }

function js() {
	return gulp.src(['./src/assets/js/smooth-scroll.min.js', './src/assets/js/default.js', './src/assets/js/dev.js'])
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(gulpif(isProd, jsImport({
			hideConsole: true
		})))
		.pipe(concat('main.js'))
		.pipe(gulpif(isProd, uglify()))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(gulpif(isSync, browserSync.stream()));
}

function es(){
	return gulp.src('./src/assets/js/*.js')
		.pipe(terser())
		.pipe(gulp.dest('./build/assets/js'));
}

function watch(){
	if(isSync){
		browserSync.init({
			notify: false,
			server: {
				baseDir: "./build/",
			}
		});
	}

	gulp.watch('./src/**/*.html', html);
	gulp.watch('./src/template/data/*.yml', html);
	gulp.watch('./src/assets/ico/**', icon);
	gulp.watch('./src/assets/fonts/**', fonts);
	gulp.watch('./src/assets/js/*.js', js);
	gulp.watch('./smartgrid.js', grid);
	gulp.watch('./src/assets/img/**', img);
	gulp.watch('./src/**/*.less', styles);
}

function grid(done){
	delete require.cache[require.resolve('./smartgrid.js')];

	let settings = require('./smartgrid.js');
	smartgrid('./src/assets/css/base', settings);

	done();
}

let build = gulp.series(clear,
	gulp.parallel(html, styles, icon, favicon, js, fonts, img )
);

gulp.task('build', gulp.series(grid, build));
gulp.task('watch', gulp.series(build, watch));
gulp.task('grid', grid);
gulp.task('critical', criticalCSS);
gulp.task('compress', es);