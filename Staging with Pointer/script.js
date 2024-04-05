console.clear();
const showcase1 = document.getElementById('showcase-iframe1');
const showcaseWindow1 = showcase1.contentWindow;
let mpSdk;
var button = document.getElementById('button');
const dropdown = document.getElementById('model_dropdown');

const models = [
  {
    url: "http://localhost:8080/model/roundChair/scene.gltf",
    scale: { x: 0.5, y: 0.5, z: 0.5 }
  },
  {
    url: "http://localhost:8080/model/luke/glTF/luke.gltf",
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    url: "http://localhost:8080/model/couch/scene.gltf",
    scale: { x: 0.02, y: 0.02, z: 0.02 }
  },
  {
    url: "http://localhost:8080/model/blueChair/scene.gltf",
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    url: "http://localhost:8080/model/2.gltf",
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    url: "http://localhost:8080/model/chair.gltf",
    scale: { x: 1, y: 1, z: 1 }
  },
  {
    url: "http://localhost:8080/model/tab/table.gltf",
    scale: { x: 1, y: 1, z: 1 }
  }
];

showcase1.addEventListener('load', async function () {
  try {
    mpSdk = await showcaseWindow1.MP_SDK.connect(showcaseWindow1);
  }
  catch (e) {
    console.error(e);
    return;
  }

  dropdown.addEventListener('change', async () => {
    const selectedIndex = dropdown.value;
    const model = models[selectedIndex];
    const [sceneObject] = await mpSdk.Scene.createObjects(1);
    const node = sceneObject.addNode();

    const initial = {
      url: model.url,
      visible: true,
      localScale: model.scale,
      localPosition: { x: 0, y: 0, z: 0 },
      localRotation: model.rotation || { x: 0, y: 0, z: 0 }
    };

    node.addComponent('mp.gltfLoader', initial);
    node.addComponent('mp.ambientLight');
    node.addComponent('mp.directionalLight');

    var poseCache;
    mpSdk.Camera.pose.subscribe(function (pose) {
      poseCache = pose;
    });

    var intersectionCache;
    mpSdk.Pointer.intersection.subscribe(function (intersection) {
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
        button.style.left = `${coord.x - 15}px`;
        button.style.top = `${coord.y - 12}px`;
        button.style.display = 'block';
        buttonDisplayed = true;
      }
    }, 16);


    button.addEventListener('click', function (e) {
      node.position.set(intersectionCache.position.x, intersectionCache.position.y, intersectionCache.position.z);
      node.start();
      button.style.display = 'none';
      showcase1.focus();
      //e.preventDefault();
      e.stopPropagation();
    });

  });

});
