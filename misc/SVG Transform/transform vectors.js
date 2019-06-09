(parseInt(str[1]+str[1], 16));
				rgb.push(parseInt(str[2]+str[2], 16));
				rgb.push(parseInt(str[3]+str[3], 16));
			}
		}else if(arguments.length == 3){
			rgb = [arguments[0], arguments[1], arguments[2]];
		}

		this.red = parseInt(rgb[0]);
		this.green = parseInt(rgb[1]);
		this.blue = parseInt(rgb[2]);

		this.testLimits();