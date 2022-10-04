//add your track here (timestamp,lat,lon)
var tracklist = [
    [123.4,37.781814, -122.404740],
    [123.4,37.781719, -122.404637],
    [123.4,37.781489, -122.404949],
    [123.4,37.780704, -122.403945],
    [123.4,37.780012, -122.404827]
];

//extract only lat/lon
var pointList = [ ]; 
for (let i = 0; i < tracklist.length; i++){
    pointList.push([tracklist[i][1],tracklist[i][2]])
}