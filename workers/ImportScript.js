function ImportScript(url, onloadFunction, onErrorFunction) {
	const script = document.createElement('script');

	script.src = url;
	script.async = true;

	if (onloadFunction)
		script.onload = onloadFunction;
	script.onerror = function (e) {
		script.parentNode.removeChild(script);
		if (onErrorFunction)
			onErrorFunction();
	};

	document.body.appendChild(script);

	return () => {
		document.body.removeChild(script);
	}
}