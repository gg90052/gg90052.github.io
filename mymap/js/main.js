"use strict";

var googleMap = new Vue({
  el: '#app',
  data: {
    map_center: {
      lat: 25.048554,
      lng: 121.517469
    },
    map: null,
    place: null,
    // 存place確定後回傳的資料
    markers: [],
    saved_data: [],
    infoWindow: '',
    menu_show: false,
    list_show: false,
    now_open: -1
  },
  methods: {
    // init google map
    initMap: function initMap() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: this.map_center,
        zoom: 16,
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_BOTTOM
        }
      });

      if (localStorage.geoJSON) {
        this.addMarker(JSON.parse(localStorage.geoJSON));
      } else {
        this.menu_show = true;
      } // if (navigator.geolocation) {
      //     navigator.geolocation.getCurrentPosition(position=> {
      //         let pos = {
      //             lat: position.coords.latitude,
      //             lng: position.coords.longitude
      //         };
      //         this.map.setCenter(pos);
      //     });
      // } else {
      //     alert("錯誤！");
      // }

    },
    open: function open(index) {
      if (index == this.now_open) {
        this.now_open = -1;
      } else {
        this.now_open = index;
      }
    },
    addMarker: function addMarker(data) {
      var _this = this;

      var vm = this;
      this.saved_data = data;
      this.map_center = {
        lat: data[0].position[0],
        lng: data[0].position[1]
      };
      this.map.setCenter(this.map_center);
      this.map.setZoom(13);

      var _loop = function _loop(i) {
        _this.markers[i] = new google.maps.Marker({
          position: {
            lat: data[i].position[0],
            lng: data[i].position[1]
          },
          map: _this.map
        });
        _this.infowindow = new google.maps.InfoWindow();

        _this.markers[i].addListener('click', function (e) {
          this.infowindow.setContent(addContent(data[i], i));
          this.infowindow.open(this.map, this.markers[i]);
        }.bind(_this));
      };

      for (var i = 0; i < data.length; i++) {
        _loop(i);
      }

      function addContent(data, index) {
        var description = data.description ? data.description : '';
        var google = "<button class=\"search\" onclick=\"googleMap.getPlace('".concat(data.name, "', ").concat(index, ")\">\u5F9Egoogle\u53D6\u5F97\u8CC7\u8A0A</button>");

        if (data.detail) {
          google = vm.groupGmapData(data.detail);
        }

        var info = "\n                <div class=\"info_box\">\n                    <b>".concat(data.name, "</b>\n                    <p>(").concat(data.position.toString(), ")</p>\n                    <br>\n                    <p class=\"description\">").concat(description, "</p>\n                    ").concat(google, "\n                </div>\n                ");
        return info;
      }
    },
    getPlace: function getPlace(place, index) {
      var vm = this;

      if (vm.saved_data[index].detail) {
        vm.appendGmap(vm.saved_data[index].detail);
        return false;
      }

      var service = new google.maps.places.PlacesService(this.map);
      var query = {
        query: place,
        fields: ['place_id']
      };
      service.findPlaceFromQuery(query, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          getDetail(results[0].place_id).then(function (place) {
            vm.saved_data[index].detail = place;
            localStorage.geoJSON = JSON.stringify(vm.saved_data);
            vm.appendGmap(place);
          });
        }
      });

      function getDetail(place_id) {
        return new Promise(function (resolve, reject) {
          var request = {
            placeId: place_id,
            fields: ['formatted_address', 'geometry', 'name', 'photo', 'place_id', 'url']
          };
          service.getDetails(request, function (place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(vm.transformPlace(place));
            }
          });
        });
      }
    },
    transformMarker: function transformMarker(geoJSON) {
      var newArr = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = geoJSON.features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;
          var obj = {
            position: [i.geometry.coordinates[1], i.geometry.coordinates[0]],
            name: i.properties.name,
            description: setTag(i.properties.description)
          };
          newArr.push(obj);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      function setTag(description) {
        var img = '';

        if (description) {
          //取出圖片
          var imgReg = /<img.*?(?:>|\/>)/gi;
          var imgArr = description.match(imgReg);

          if (imgArr) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = imgArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var i = _step2.value;
                img += i + '<br>';
                description = description.replace(i, '');
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                  _iterator2["return"]();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }

          var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi; // 把超鏈結文字轉成超鏈結

          description = description.replace(/<br>/g, ' <br>');
          var match = description.match(regexp);

          if (match) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = match[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var _i = _step3.value;
                description = description.replace(_i, "<a href=\"".concat(_i, "\" target=\"_blank\">").concat(_i, "</a>"));
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                  _iterator3["return"]();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }

          description = img + description;
        } else {
          description = '';
        }

        return description;
      }

      return newArr;
    },
    transformPlace: function transformPlace(place) {
      var obj = {
        name: place.name,
        position: [place.geometry.location.lng(), place.geometry.location.lat()],
        address: place.formatted_address,
        photo: place.photos[0].getUrl(),
        place_id: place.place_id,
        gmap_url: place.url
      };
      return obj;
    },
    appendGmap: function appendGmap(place) {
      var info_content = this.infowindow.getContent();
      var start = info_content.indexOf('<button');
      var end = info_content.indexOf('</button>', start) + 9;
      var btn_str = info_content.substring(start, end);
      info_content = info_content.replace(btn_str, '');
      info_content += this.groupGmapData(place);
      this.infowindow.setContent(info_content);
    },
    groupGmapData: function groupGmapData(place) {
      return "\n            <div class=\"gmap\">\n            <p class=\"name\">".concat(place.name, "</p>\n            <p class=\"address\">").concat(place.address, "</p>\n            <a href=\"").concat(place.gmap_url, "\" target=\"_blank\">\u4EE5google map\u958B\u555F\u9019\u500B\u5730\u9EDE</a>\n            </div>\n            ");
    },
    aboutOpen: function aboutOpen(e) {}
  },
  mounted: function mounted() {
    var _this2 = this;

    var vm = this;
    window.addEventListener('load', function () {
      _this2.initMap();
    });
    $('#kml_file').on('change', function () {
      var file = document.getElementById("kml_file").files[0];
      var reader = new FileReader();
      reader.readAsText(file);

      reader.onloadend = function () {
        var geoJSON = vm.transformMarker(toGeoJSON['kml'](new DOMParser().parseFromString(reader.result, 'text/xml')));
        localStorage.geoJSON = JSON.stringify(geoJSON);
        vm.list_show = false;
        vm.addMarker(geoJSON);
      };
    });
  }
});