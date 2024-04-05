console.clear();
const showcase1 = document.getElementById('showcase-iframe1');
const showcaseWindow1 = showcase1.contentWindow;
let mpSdk;

var text = document.getElementById('text');
var button = document.getElementById('button');

function pointToString(point) {
    var x = point.x.toFixed(3);
    var y = point.y.toFixed(3);
    var z = point.z.toFixed(3);

    return `{ x: ${x}, y: ${y}, z: ${z} }`;
}

showcase1.addEventListener('load', async function () {
    try {
        mpSdk = await showcaseWindow1.MP_SDK.connect(showcaseWindow1);
    }
    catch (e) {
        console.error(e);
        return;
    }

    var poseCache;
    mpSdk.Camera.pose.subscribe(function(pose) {
    poseCache = pose;
  });

  var intersectionCache;
  mpSdk.Pointer.intersection.subscribe(function(intersection) {
    console.log(intersection);
    intersectionCache = intersection;
    intersectionCache.time = new Date().getTime();
    button.style.display = 'none';
    buttonDisplayed = false;
  });

  var delayBeforeShow = 1000;
  var buttonDisplayed = false;
  setInterval(() => {
    if (!intersectionCache || !poseCache) {
      return;
    }

    const nextShow = intersectionCache.time + delayBeforeShow;
    if (new Date().getTime() > nextShow) {
      if (buttonDisplayed) {
        return;
      }

      var size = {
        w: showcase1.clientWidth,
        h: showcase1.clientHeight,
      };
      var coord = mpSdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
      button.style.left = `${coord.x - 25}px`;
      button.style.top = `${coord.y - 22}px`;
      button.style.display = 'block';
      buttonDisplayed = true;
    }
  }, 16);


  button.addEventListener('click', function() {
    text.innerHTML = `position: ${pointToString(intersectionCache.position)}\nnormal: ${pointToString(intersectionCache.normal)}\nfloorId: ${intersectionCache.floorId}`;
    button.style.display = 'none';
    showcase1.focus();
  });

});