	/*

	The MIT License (MIT)

	Copyright (c) 2014 aadu999
	For Sited.in
	http://sited.in

	Design & Coding : Adarsh

	*/


	navigator.getUserMedia = ( navigator.getUserMedia ||
						   navigator.webkitGetUserMedia ||
						   navigator.mozGetUserMedia ||
						   navigator.msGetUserMedia);

	var AudioContext = window.AudioContext || window.webkitAudioContext;

	var context = new window.AudioContext();
	navigator.getUserMedia({audio: true}, gotUserAudio, userAudioDenied);
	var aadu=0;
	function autoCorrelate(buf, sampleRate) {
		var MIN_SAMPLES = 4;
		var MAX_SAMPLES = 1000;
		var SIZE = 1000;
		var best_offset = -1;
		var best_correlation = 0;
		var rms = 0;
		var foundGoodCorrelation = false;

		if (buf.length < (SIZE + MAX_SAMPLES - MIN_SAMPLES))
			return -1; //not enough data

		for (var i =0;i<SIZE;i++) {
			var val = (buf[i] - 128)/128;
		}
		var lastCorrelation=1;
		for (var offset=MIN_SAMPLES;offset <= MAX_SAMPLES; offset++) {
			var correlation = 0;
			for (var i = 0;i<SIZE;i++) {
				correlation += Math.abs(((buf[i]-128)/128)-((buf[i+offset] - 128)/128));
			}
			correlation = 1 - (correlation/SIZE);
			if ((correlation>0.9) && (correlation > lastCorrelation))
				foundGoodCorrelation = true;
			else if (foundGoodCorrelation) {
				return sampleRate/best_offset;
			}
			lastCorrelation = correlation;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		}
		if (best_correlation > 0.01) {
			return sampleRate/best_offset;
		}
		return -1;
	}

	function gotUserAudio(stream) {
		sendMessage('Give us a whistle');
		var microphone = context.createMediaStreamSource(stream);
		var analyser = context.createAnalyser();
		microphone.connect(analyser);
		var freqDomain = new Float32Array(analyser.frequencyBinCount);
		analyser.getByteTimeDomainData(freqDomain);
		var pitch;
		window.setInterval(function(){
			array = new Uint8Array(512);
			analyser.getByteTimeDomainData(array);

			pitch = autoCorrelate(array, context.sampleRate)

			if (pitch != 11025) {
				var pitchScore = Math.floor((pitch - 1000) / 100);
				//sendMessage(pitchScore); 
				if (pitchScore <= 11) {
					moveladki(pitchScore);                          
				};
			};
		},50);
	}

	function userAudioDenied() {
		sendMessage('Girl can\'t hear you');
	}

	function moveladki(score) {

			
			sendMessage('');
			function drawBubbles(x,y,direction) {
				for (var i=0;i<20;i++) {
					var addX = Math.random() * 40;
					var addY = Math.random() * 100;
					if (direction==='down') {
						var circle = s.circle(x-addX,y-addY,20);
					} else {
						var circle = s.circle(x+addX,y+addY,20);
					}
					var color = '#'+Math.floor(Math.random()*16777215).toString(16);
					circle.attr({
						fill: color,
					});
					circle.animate({r: 0},1000)				
				}

				var circle = s.circle(x,y,20);
				circle.attr({
					fill: "#bada55",
				});
				circle.animate({r: 0},1000)
			}

			function move(y,direction) {
				var moveUp = true;
				var moveDown = true;
				var moveRight = true;
				var moveLeft = true;
				if (score >= 4) {
					//var rotation = Math.floor(Math.random() * 140 - 70);
					var rotation = Math.floor(Math.random() * 140 - 70);
									//var calcRotation = rotation;
					var calcRotation = rotation;
				} else {
					//var rotation = Math.floor(Math.random() * 140 + 110);
					 var rotation = Math.floor(Math.random() * 140 + 110);
									  // var calcRotation = rotation - 110;
									 var calcRotation = rotation - 110;
				}
				//if going up, calculate angle between -90/180 and 90
				//if going down, find angle between 90 and 180
				var y = 80;
				var rotationRadians = calcRotation * (Math.PI / 180);
				var moveX = Math.tan(rotationRadians) * y;
				//console.log(moveX);
							//moveX = 0;
			/*	//scoring algo
				var aadix=($('.ladki_box').offset().left+$('.ladki_box').width()+moveX);
				var aadiy=$('.ladki_box').offset().top;
				var chheight=$('.cherukkan').height();
				var chwidth=$('.cherukkan').width();
				var bh=($(window).height() - chheight - (chheight / 100 * 20));
				var bw=($(window).width() - chwidth - (chwidth / 100 * 60) );
				//console.log('Movex ='+$('.ladki_box').offset().left+$('.ladki_box').width()+moveX+' y='+$('.ladki_box').offset().top+$('.ladki_box').height()+y);
				//console.log('aadix='+aadix+' aadiy='+aadiy+' bh='+bh+' bw='+bw);
				//scoring algo */
				if (($('.ladki_box').offset().top + $('.ladki_box').height() + y) > $(window).height()) {
					var moveDown = false;
					console.log('went off bottom');
					sendMessage('Whistle higher to ascend');
				} else if ($('.ladki_box').offset().top - y < 0) {
					var moveUp = false;
					console.log('went off top');
					sendMessage('Whistle lower to go down');
				}
				if ($('.ladki_box').offset().left + moveX < 0) {
					var moveLeft = false;
					console.log('went off left');			
				}
							
						   /* if ($('.ladki_box').offset().left + moveX > 450 ) {
					var moveLeft = false;
					console.log('You Are Close');
									sendMessage('You are close');			
				}
							if ($('.ladki_box').offset().left + moveX > 450 ) {
					var moveLeft = false;
					console.log('You Are Close');
									sendMessage('You are close');			
				} */  

				if ($('.ladki_box').offset().left + $('.ladki_box').width() + moveX > $(window).width()) {
					var moveRight = false;
					console.log('went off left');
				}

				console.log($('.ladki_box').queue('fx').length);
				if ($('.ladki_box').queue('fx').length) {
					return;
				}
				console.log('new move added');
				y = 80;
				if (moveLeft === false || moveRight === false) {
					console.log('cancelling left or right move');
					moveX = 0;
				}
				if (direction === 'down' && moveDown) {
					$('.ladki').transition({duration:100});
					$('.ladki_box').transition({y:'+='+y,x:'+='+moveX,duration:500},'linear');	
					drawBubbles($('.ladki').offset().left + $('.ladki').width() / 2,$('.ladki').offset().top + $('.ladki').height() / 2, 'down');
									console.log('Movex ='+moveX);
									var aadix=($('.ladki_box').offset().left+$('.ladki_box').width()+moveX);
				var aadiy=$('.ladki').offset().top +y;
				var chheight=$('.cherukkan').height();
				var chwidth=$('.cherukkan').width();
				var bh=($(window).height() - chheight - (chheight / 100 * 20));
				var bw=($(window).width() - chwidth - (chwidth / 100 * 60) );
				var bhl=bh-100;
				var bwl=bw-150;
				var bkh=($(window).height() - chheight - 80);
				var bkw=($(window).width() - (chwidth / 100 * 53.3));
				//var bhl=($(window).height() - chheight + (chheight / 100 * 40));
				//var bwl=($(window).width() - chwidth + (chwidth / 100 * 60) );
								  console.log('aadix='+aadix+' aadiy='+aadiy+' bh='+bh+' bw='+bw+' bhl='+bhl+' bwl='+bwl+' bkw='+bkw+' bkh='+bkh);								
						if(aadiy>bkh && aadix>bkw){
						console.log('The Angel Kissed you');
						$('.kiss').show();
						$('.message').hide();
						aadu=1;
						}
						if(aadiy>bh && aadix>bw)
						{ console.log('congo');
							sendMessage('You are very close');
							$('#surface').show();
							}
						 if (aadiy<bh && aadiy>bhl && aadix<bw) {
							console.log('You are getting closer')
							sendMessage('You are getting closer');
							$('#surface').show();
							}
							
							
				} else if (direction === 'up' && moveUp) {
					drawBubbles($('.ladki').offset().left + $('.ladki').width() / 2,$('.ladki').offset().top + $('.ladki').height() / 2, 'up');
					$('.ladki').transition({duration:100});
					$('.ladki_box').transition({y:'-='+y,x:'+='+moveX,duration:500},'linear');
						console.log('Movex ='+moveX);
						var aadix=($('.ladki_box').offset().left+$('.ladki_box').width()+moveX);
				var aadiy=$('.ladki').offset().top -y;
				var chheight=$('.cherukkan').height();
				var chwidth=$('.cherukkan').width();
				var bh=($(window).height() - chheight - (chheight / 100 * 20));
				var bw=($(window).width() - chwidth - (chwidth / 100 * 60) );
				var bhl=bh-100;
				var bwl=bw-150;
				var bkh=($(window).height() - chheight - 80);
				var bkw=($(window).width() - (chwidth / 100 * 53.3));
				//var bhl=($(window).height() - chheight + (chheight / 100 * 40));
				//var bwl=($(window).width() - chwidth + (chwidth / 100 * 60) );
						console.log('aadix='+aadix+' aadiy='+aadiy+' bh='+bh+' bw='+bw+' bhl='+bhl+' bwl='+bwl+' bkw='+bkw+' bkh='+bkh);
						if(aadiy>bkh && aadix>bkw){
						console.log('The Angel Kissed you');
						$('.kiss').show();
						$('.message').hide();
						aadu=1;
						}
						if(aadiy>bh && aadix>bw)
						{ console.log('congo');
						  sendMessage('You are very close');
						  $('#surface').show();
						}
							
							 if (aadiy<bh && aadiy>bhl && aadix<bw) {
							console.log('You are getting closer')
							sendMessage('You are getting closer');
							$('#surface').show();
							}
							
							
			   }
			}
			switch (score) {
				case -1:
					move(10,'down')
				case 0:
					move(10,'down')
				case 1:
					move(10,'down')
					console.log('case 1');
									break;
				case 2:
					move(10,'down')
									console.log('case 2');
					break;
				case 3:
					move(10,'down')
					console.log('case 3');
									break;
				case 4:
					move(10,'up')
					console.log('case 4');
									break;
				case 5:
					move(10,'up')
					console.log('case 5');
									break;																
				case 6:
					move(10,'up')
					console.log('case 6');
									break;
				case 7:
					move(10,'up')
					console.log('case 7');
									break;
				case 8:
					move(10,'up')
					console.log('case 8');
									break;
				case 9:
					move(10,'up')
					console.log('case 9');
									break;		
				case 10:
					move(10,'up')			
					console.log('case 10');
									break;
				case 11:
					move(10,'up')			
					console.log('case 11');
									break;			
			}
	}

	function sendMessage(message) {	
		$('.message').fadeOut('slow', function() {
			$('.message').text(message).fadeIn('slow');
		});
	}

	var s;

	$(document).ready(function() {
		sendMessage('We need to hear you');
		
		s = Snap('#canvas');
		$('#surface').hide();
		$('.kiss').hide();
	if(aadu==1)
	{
	$('.message').hide();
	}	
	});	
