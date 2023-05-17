const { series, watch } = require("gulp")

const browserSync = require("browser-sync").create()
const reload = browserSync.reload

function startBrowserSync(done) {
	browserSync.init({
		server: {
			baseDir: "./",
		},
	})

	done()
}

function watchForChanges(done) {
	watch("./*.html").on("change", reload)
	watch("./*.css").on("change", reload)
	watch("./*.js").on("change", reload)
	done()
}

exports.default = series(startBrowserSync, watchForChanges)
