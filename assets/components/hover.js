AFRAME.registerComponent('hover', {
	tick: function () {
		var el = this.el;
		el.setAttribute('position', '1 ' + (.75 + Math.sin(Date.now() / 500) * .25) + ' -3');
	}
});