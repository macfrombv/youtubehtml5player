var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

// Copyright 2008 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview Demo for HTML5 video tag.
 * @author czacharias@google.com (Chris Zacharias)
 */
(function() {

	if (Array.prototype.forEach === undefined) {
		Array.prototype.forEach = function(callback, thisObj) {
			var arr = this;
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				fn.call(thisObj || this, arr[i], i);
			};
		};
	};

	if (NodeList.prototype.forEach === undefined) {
		NodeList.prototype.forEach = function(callback, thisObj) {
			Array.prototype.forEach.call(this, callback, thisObj);
		};
	};

	var bind = function(fn, thisObj) {
		return function() {
			var args = Array.prototype.slice.call(arguments, 0);
			var result = fn.apply(thisObj, args);
			return result;	
		};
	};

	var hasClass = function(node, cssClass) {
		var classes = node.className.split(" ");
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] == cssClass) {
				return true;
			};
		};
		return false;
	};

	var addClass = function(node, cssClass) {
		var classes = node.className.split(" ");
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] == cssClass) {
				return false;
			};
		};
		classes.push(cssClass);
		node.className = classes.join(" ");
		return true;
	};

	var removeClass = function(node, cssClass) {
		var classes = node.className.split(" ");	
		var remainingClasses = [];
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] != cssClass) {
				remainingClasses.push(classes[i]);
			};
		};
		node.className = remainingClasses.join(" ");
		return remainingClasses.length != classes.length;
	};

	var toggleClass = function(node, cssClass) {
		var classes = node.className.split(" ");
		var resultClasses = [];
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] != cssClass) {
				resultClasses.push(classes[i]);
			};
		};
		if (resultClasses.length == classes.length) {
			resultClasses.push(cssClass);
		};
		node.className = resultClasses.join(" ");
	};

	var suppressEvent = function(evt) {
		evt.stopPropagation();
		return false;
	};

	var getPagePosition = function(node) {
		var pageLeft = 0;
		var pageTop = 0;
		if (node.offsetParent) {
			do {
				pageLeft += node.offsetLeft;
				pageTop += node.offsetTop;
			} while (node = node.offsetParent);
		};
		return { "left": pageLeft, "top": pageTop };
	};

	var createYouTubePlayer = function(node) {
		return new YouTubePlayer(node);
	};

	var YouTubePlayer = function(node) {
		this.video_ = node.querySelector("video");
		this.video_.addEventListener("play", bind(this.onPlay_, this), false);
		this.video_.addEventListener("pause", bind(this.onPause_, this), false);
		this.video_.addEventListener("load", bind(this.onLoad_, this), false);
		this.video_.addEventListener("volumechange", bind(this.onVolumeChanged_, this), false);
		this.video_.addEventListener("ended", bind(this.onEnded_, this), false);

		this.playButton_ = node.querySelector(".play-button");
		this.playButton_.addEventListener("click", bind(this.playPauseVideo_, this), false);

		this.currentTime_ = node.querySelector(".current-time");
		this.durationTime_ = node.querySelector(".duration-time");

		this.progressContainer_ = node.querySelector(".progress-list");
		this.progressContainer_.addEventListener("click", bind(this.onVideoSeeking_, this), false);

		this.playProgress_ = node.querySelector(".play-progress");
		this.loadProgress_ = node.querySelector(".load-progress");

		this.scrubberButton_ = node.querySelector(".scrubber-button");
		this.scrubberButton_.addEventListener("drag", bind(this.onVideoSeeking_, this), false);

		this.volumeButton_ = node.querySelector(".volume-button");
		this.volumeButton_.addEventListener("click", bind(this.toggleMute_, this), false);

		this.volumePanel_ = node.querySelector(".volume-panel");
		this.volumePanel_.addEventListener("click", suppressEvent, false);

		this.volumeSlider_ = node.querySelector(".volume-slider");
		this.volumeSlider_.addEventListener("drag", bind(this.onVolumeSliding_, this), false);

		this.volumeChannel_ = node.querySelector(".volume-channel");

		this.hdButton_ = node.querySelector(".hd-button");
		this.hdButton_.addEventListener("click", bind(this.toggleHighDef_, this), false);
	};

	YouTubePlayer.prototype.video_ = null;
	YouTubePlayer.prototype.playButton_ = null;
	YouTubePlayer.prototype.currentTime_ = null;
	YouTubePlayer.prototype.durationTime_ = null;
	YouTubePlayer.prototype.progressContainer_ = null;
	YouTubePlayer.prototype.playProgress_ = null;
	YouTubePlayer.prototype.loadProgress_ = null;
	YouTubePlayer.prototype.scrubberButton_ = null;
	YouTubePlayer.prototype.volumeButton_ = null;
	YouTubePlayer.prototype.volumePanel_ = null;
	YouTubePlayer.prototype.volumeSlider_ = null;
	YouTubePlayer.prototype.volumeChannel_ = null;
	YouTubePlayer.prototype.hdButton_ = null;
	YouTubePlayer.prototype.interval_ = null;

	YouTubePlayer.prototype.onLoad_ = function() {
		this.onInterval_();
		this.interval_ = window.setInterval(bind(this.onInterval_, this), 100);
	};

	YouTubePlayer.prototype.onInterval_ = function() {
		this.updateTimes_();
		this.updateProgress_();
	};

	YouTubePlayer.prototype.onVolumeChanged_ = function() {
		if (this.video_.muted) {
			this.volumeButton_.value = "off";
		} else if (this.video_.volume < 0.2) {
			this.volumeButton_.value = "min";
		} else if (this.video_.volume < 0.4) {
			this.volumeButton_.value = "quiet";
		} else if (this.video_.volume < 0.6) {
			this.volumeButton_.value = "normal";
		} else if (this.video_.volume < 0.8) {
			this.volumeButton_.value = "loud";
		} else {
			this.volumeButton_.value = "max";
		}
		if (!this.video_.muted) {
			this.volumeSlider_.style.top = (100 - (this.video_.volume * 100)) + "%";
		} else {
			this.volumeSlider_.style.top = "100%";
		}
	};

	YouTubePlayer.prototype.toggleMute_ = function() {
		this.video_.muted = !this.video_.muted;
	};

	YouTubePlayer.prototype.toggleHighDef_ = function() {
		if (this.hdButton_.value == "off") {
			this.hdButton_.value = "on";
		} else {
			this.hdButton_.value = "off";
		}
	};

	YouTubePlayer.prototype.updateTimes_ = function() {
		this.durationTime_.innerHTML = this.formatTime_(this.video_.duration);
		this.currentTime_.innerHTML = this.formatTime_(this.video_.currentTime);
	};

	YouTubePlayer.prototype.updateProgress_ = function() {
		var playValue = this.video_.currentTime / this.video_.duration;
		this.playProgress_.setAttribute("value", playValue);
		this.playProgress_.style.width = (playValue * 100) + "%";
		this.scrubberButton_.style.left = (playValue * 100) + "%";

		if (this.video_.buffered.length > 0) {
			var loadValue = this.video_.buffered.end(0) / this.video_.duration;
			this.loadProgress_.setAttribute("value", loadValue);
			this.loadProgress_.style.width = (loadValue * 100) + "%";
		};
	};

	YouTubePlayer.prototype.onPlay_ = function() {
		this.playButton_.className = "pause-button";
	};

	YouTubePlayer.prototype.onPause_ = function() {
		this.playButton_.className = "play-button";
	};

	YouTubePlayer.prototype.onEnded_ = function() {
		this.playButton_.className = "play-button";
	};

	YouTubePlayer.prototype.playPauseVideo_ = function() {
		if (this.video_.ended) {
			this.video_.currentTime = 0;
			this.video_.play();
		} else if (this.video_.paused) {
			this.video_.play();
		} else {
			this.video_.pause();
		};
	};

	YouTubePlayer.prototype.formatTime_ = function(time) {
		var totalSeconds = parseInt(time);
		var hours = parseInt(totalSeconds / 3600);
		var minutes = parseInt((totalSeconds % 3600) / 60);
		var seconds = parseInt(totalSeconds % 60);
		var result = "";
		if (hours > 0) {
			result += hours.toString() + ":";
		}
		if (minutes < 10) {
			result += "0";
		}
		result += minutes.toString() + ":";
		if (seconds < 10) {
			result += "0";
		}
		result += seconds.toString();
		return result;
	};

	YouTubePlayer.prototype.onVideoSeeking_ = function(evt) {
		var position = getPagePosition(this.progressContainer_);
		var width = this.progressContainer_.clientWidth;
		var seekTo = ((evt.pageX - position.left) / (width - 1)) * this.video_.duration;
		this.video_.currentTime = seekTo;
		this.updateProgress_();
        evt.stopPropagation();
		return false;
	};

	YouTubePlayer.prototype.onVolumeSliding_ = function(evt) {
		var position =  getPagePosition(this.volumeChannel_);
		var height = this.volumeChannel_.clientHeight;
		var volumeTo = ((evt.pageY - position.top) / (height - 1));
		if (volumeTo < 0.0) {
			volumeTo = 0.0;
		} else if (volumeTo > 1.0) {
			volumeTo = 1.0;
		}
		this.video_.volume = (1.0 - volumeTo);
		if (this.video_.muted) {
			this.video_.muted = false;
		};
        evt.stopPropagation();
		return false;
	};

	var initUserInterface = function() {
		var playerNode = document.getElementById("video-player");
		var player = createYouTubePlayer(playerNode);

		var detailNodes = document.querySelectorAll(".details");
			detailNodes.forEach(function(detailNode) {
				var legendNode = detailNode.firstElementChild;
				legendNode.addEventListener("click", function(evt) {
					if (!hasClass(detailNode, "ignore-open")) {
						toggleClass(detailNode, "open");
					};
				}, false);
			});

		var videoThumbnails = document.querySelectorAll(".video-thumb");
			videoThumbnails.forEach(function(videoThumbnail) {
				videoThumbnail.muted = true;	
				videoThumbnail.defaultPlaybackRate = 3.0;
				videoThumbnail.addEventListener("mouseover", function(evt) {
					var videoNode = evt.target;
						videoNode.play();
				}, false);
				videoThumbnail.addEventListener("mouseout", function(evt) {
                    var videoNode = evt.target;
						videoNode.pause();
						videoNode.currentTime = 0;
				}, false);
				videoThumbnail.addEventListener("ended", function(evt) {
					var videoNode = evt.target;
						videoNode.currentTime = 0;
				}, false);
			});
	};

	window.addEventListener("load", initUserInterface, false);


})();


}
