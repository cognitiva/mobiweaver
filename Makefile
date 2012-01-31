BUILD_DIR = build
SEARCHHELP_JS = mobiweaver/javascript/jquery.mobiweaver.searchhelp.js
SEARCHHELP_MIN_JS = ${BUILD_DIR}/jquery.mobiweaver.searchhelp.min.js
JQUERYMOBILE_JS = jquerymobile/jquery.mobile-1.0.mobiweaver.js
JQUERYMOBILE_MIN_JS = ${BUILD_DIR}/jquery.mobile-1.0.mobiweaver.min.js

#MIN ?= `which uglifyjs 2>/dev/null`
MIN = java -jar /home/nuno/dev/js/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar


all: ${SEARCHHELP_MIN_JS} ${JQUERYMOBILE_MIN_JS}


${BUILD_DIR}:
	@@mkdir -p ${BUILD_DIR}


${SEARCHHELP_MIN_JS}: ${SEARCHHELP_JS} ${BUILD_DIR}
	echo "Minifying Search Help Widget " ${SEARCHHELP_MIN_JS}
	${MIN} ${SEARCHHELP_JS} > ${SEARCHHELP_MIN_JS}


${JQUERYMOBILE_MIN_JS}: ${JQUERYMOBILE_JS} ${BUILD_DIR}
	echo "Minifying Patched jQueryMobile " ${JQUERYMOBILE_JS}
	${MIN} ${JQUERYMOBILE_JS} > ${JQUERYMOBILE_MIN_JS}
