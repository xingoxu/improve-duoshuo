/**
 * @author xingo
 * @date 2016-12-25
 * @version 0.33 beta
 * @description 多说显示UA Admin
 * @update 替换多说开发版，尝试替换https
 */
var userTail = (function () {
  var checkMobile = function () {
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if (isiPad) {
      return false;
    }
    var isMobile = navigator.userAgent.match(/iphone|android|phone|mobile|wap|netfront|x11|java|opera mobi|opera mini|ucweb|windows ce|symbian|symbianos|series|webos|sony|blackberry|dopod|nokia|samsung|palmsource|xda|pieplus|meizu|midp|cldc|motorola|foma|docomo|up.browser|up.link|blazer|helio|hosin|huawei|novarra|coolpad|webos|techfaith|palmsource|alcatel|amoi|ktouch|nexian|ericsson|philips|sagem|wellcom|bunjalloo|maui|smartphone|iemobile|spice|bird|zte-|longcos|pantech|gionee|portalmmm|jig browser|hiptop|benq|haier|^lct|320x320|240x320|176x220/i) != null;
    if (isMobile) {
      return true;
    }
    return false;
  };
  var isAdmin = function(userInfo) {
    return userInfo.user_id == 11510067;
  }
  var regexMatch = function (regexArray, uaString) {
    var length = regexArray.length - 1;
    for (var i = 0; i < length; i++) {
      var regexItem = regexArray[i];
      var matchResultArray = regexItem[0].exec(uaString);
      if (matchResultArray) {
        if (typeof (regexItem[2]) === "function") {
          return regexItem[2](matchResultArray, uaString);
        } else if (regexItem[1]) {
          return regexItem[1];
        } else return matchResultArray[0];
      }
    }
    return false;
  };
  //init OSRegexs
  var OSRegexs = [
    // Windows based
    [
      /(windows\sphone(?:\sos)*|windows\smobile)[\s\/]?([ntce\d\.\s]+\w)/i //Windows Mobile/Phone
    ],
    [
      /microsoft\s(windows)\s(vista|xp)/i // Windows (iTunes)
      , "Windows Vista/XP",
      function (matchResultArray) {
        return matchResultArray[1] + matchResultArray[2];
      }
    ],
    [
      /(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
      , "Windows RT"
    ],
    [
      /Windows XP/i

    ],
    [
      /Windows 2000/i
    ],
    [
      /WinNT(\d+.\d+)/i
    ],
    [/Win(dows )?3.11|Win16/i, "Windows 3.1"],
    [/Windows 3.1/i],
    [/Win 9x 4.90|Windows ME/i, "Windows ME"],
    [/Win98/i, "Windows 98 SE"],
    [/Windows (98|4\.10)/i, "Windows 98"],
    [/Win(dows\s)?95/i, "Windows 95"],
    [/Windows\s*NT\s*([\w.]+)/i, "Windows", function (matchResultArray, uaString) {
      var version = "";
      switch (matchResultArray[1]) {
        case "5.0":
          version = "2000";
          break;
        case "5.1":
          version = "XP";
          break;
        case "6.0":
          version = "Vista";
          break;
        case "6.1":
          version = "7";
          break;
        case "6.2":
          version = "8";
          break;
        case "6.3":
          version = "8.1";
          break;
        case "10.0":
          version = "10";
          break;
      }
      var x64String = "";
      if (typeof (uaString) === "string") {
        x64String = (/(WOW64|Win64|x64)/i).test(uaString) ? " x64" : "";
      }
      if (version === "") {
        return matchResultArray[0] + x64String;
      } else return "Windows " + version + x64String;
    }],
    [
      // Mobile/Embedded OS
      /\((bb)(10);/i // BlackBerry 10
      , "BlackBerry 10"
    ],
    [
      /(blackberry)\w*\/?([\w\.]+)*/i // Blackberry
    ],
    [
      /(tizen)[\/\s]([\w\.]+)/i // Tizen
    ],
    [
      /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i
      // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
    ],
    [
      /linux;.+(sailfish);/i // Sailfish OS
      , "Sailfish OS"
    ],
    [
      /Symbian.*Series60\/([\w.]+)/i // Symbian S60
      , "Symbian S60",
      function (matchResultArray) {
        return "Symbian S60 " + matchResultArray[1];
      }
    ],
    [
      /Symbian\/\w+/i //Symbian 3
    ],
    [
      /\((series40);/i // Series 40
      , "Symbian Series 40"
    ],
    [
      /mozilla.+\(mobile;.+gecko.+firefox/i // Firefox OS
      , "Firefox OS"
    ],
    [

      /(mint)[\/\s\(]?(\w+)*/i // Mint
    ],
    [
      /(mageia|vectorlinux)[;\s]/i // Mageia/VectorLinux
    ],
    [
      /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
      // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
      // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
    ],
    [
      /(hurd|linux)\s?([\w\.]+)*/i, // Hurd/Linux
    ],
    [
      /(gnu)\s?([\w\.]+)*/i // GNU
    ],
    [
      /(cros)\s[\w]+\s([\w\.]+\w)/i // Chromium OS
      , "Chromium OS",
      function (matchResultArray) {
        return "Chromium OS " + matchResultArray[1];
      }
    ],
    [
      // Solaris
      /(sunos)\s?([\w\.]+\d)*/i // Solaris
      , "Solaris",
      function (matchResultArray) {
        return "Solaris " + matchResultArray[2];
      }
    ],
    [
      // BSD based
      /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
    ],
    [
      /(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i // iOS
      , "iOS",
      function (matchResultArray) {
        return "iOS " + matchResultArray[2].replace(/[-_\s]/ig, ".");
      }
    ],
    [
      /(mac\sos\sx)\s?([\w\s\.]+\w)*/i,
      "Mac OS X",
      function (matchResultArray) {
        return "Mac OS X " + matchResultArray[2].replace(/[-_\s]/ig, ".");
      }
    ],
    [

      // Other
      /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i // Solaris
    ],
    [
      /(haiku)\s(\w+)/i // Haiku
    ],
    [
      /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i // AIX
    ],
    [
      /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i
      // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
    ],
    [
      /(unix)\s?([\w\.]+)*/i // UNIX
    ],
  ];
  //init DeviceRegexs
  var deviceRegexs = [
    [
      /\((ipad|playbook);[\w\s\);-]+(rim|apple)/i // iPad/PlayBook
      , "iPad/PlayBook"
    ],
    [
      /applecoremedia\/[\w\.]+ \((ipad)/i // iPad
      , "iPad"
    ],
    [
      /(apple\s{0,1}tv)/i // Apple TV
    ],
    [
      /(kindle)\/([\w\.]+)/i //old kindle
    ],
    [
      /kindle\sfire/i //new Kindle Fire
    ],
    [
      /(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i // Kindle Fire HD
      , "Kindle Fire HD"
    ],
    [
      /(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i // Fire Phone
      , "Kindle Fire Phone"
    ],
    [
      /\((ip[honead|\s\w*]+);.+(apple)/i // iPod/iPhone //\s\w for future?
      , "iPod/iPhone/iPad",
      function (matchResultArray) {
        return matchResultArray[1];
      }
    ],
    [
      /\((ip[honead|\s\w*]+);/i // iPod/iPhone //\s\w for future?
      , "iPod/iPhone/iPad",
      function (matchResultArray) {
        return matchResultArray[1];
      }
    ],
    [
      /(blackberry)[\s-]?(\w+)/i //Blackberry
    ],
    [
      /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i
      // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Huawei/Meizu/Motorola/Polytron
    ],
    [
      /(hp)\s([\w\s]+\w)/i, // HP iPAQ
    ],
    [
      /(asus)-?(\w+)/i // Asus
    ],
    [
      /\(bb10;\s(\w+)/i // BlackBerry 10
      , "BlackBerry 10"
    ],
    [
      // Asus Tablets
      /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7)/i, "Asus Tablets",
      function (matchResultArray) {
        return "Asus" + matchResultArray[1];
      }
    ],
    [
      /(sony)\s(tablet\s[ps])\sbuild\//i, // Sony

    ],
    [
      /(sony)?(?:sgp.+)\sbuild\//i
    ],
    [
      /(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i
    ],
    [
      /(nintendo)\s([wids3u]+)/i // Nintendo
    ],
    [
      /android.+;\s(shield)\sbuild/i // Nvidia
      , "Nvidia Shield Tablet"
    ],
    [
      /(playstation\s[34portablevi]+)[\s;]*([\w.]+)/i // Playstation
    ],
    [
      /(sprint\s(\w+))/i // Sprint Phones
    ],
    [
      /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i // Lenovo tablets
    ],
    [
      /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i // HTC
    ],
    [
      /(zte)-(\w+)*/i // ZTE
    ],
    [
      /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i
      // Alcatel/GeeksPhone/Huawei/Lenovo/Nexian/Panasonic/Sony
    ],
    [
      /(nexus\s9)/i // HTC Nexus 9
      , "Nexus 9"
    ],
    [
      /[\s\(;](xbox(?:\sone)?)[\s\);]/i // Microsoft Xbox
      , "XBox One"
    ],
    [
      /(kin\.[onetw]{3})/i // Microsoft Kin
      , "Microsoft Kin"
    ],
    [
      // Motorola
      /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i, ""
    ],
    [
      /mot[\s-]?(\w+)*/i
    ],
    [
      /(XT\d{3,4}) build\//i
    ],
    [
      /(nexus\s6p)/i
    ],
    [
      /(nexus\s5x)/i
    ],
    [
      /(nexus\s[6])/i, "Nexus 6"
    ],
    [
      /(lg) netcast\.tv/i // LG SmartTV
      , "LG SmartTV"
    ],
    [
      /(nexus\s[45])/i
    ],
    [

      /\s(tablet)[;\/\s]/i, // Unidentifiable Tablet
      /\s(mobile)[;\/\s]/i // Unidentifiable Mobile
    ]
  ];
  //DetectBrowser
  function BrowserDetect(uaString) {
    var browserList = [
      '11(4|5)Browser', '2345(Explorer|chrome)', 'Conkeror',
      'Alienforce', 'Amaya', "Arora",
      'Beamrise',
      'Beonex', 'Blazer', "bidubrowser", 'Blackbird',
      'Bolt', 'Browzar', 'Bunjalloo', 'Camino',
      'Chromium', 'Classilla', 'Coast', 'Columbus',
      'Cruz', 'Cyberdog', 'Demeter', 'Dooble', 'dillo',
      'Doris', 'Edbrowse', 'E?links',
      'Epiphany', 'Escape|Espial', 'Fennec',
      'Firebird', 'Flock', 'Fluid', 'Galeon',
      'Hv3', 'Iris', 'lolifox',
      'Iceape', 'Hana',
      'Kapiko', 'Kazehakase', 'Kinza', 'Konqueror', 'Kylo',
      'Lunascape', 'Lynx', 'Madfox', 'Maxthon',
      'Midori', 'Minefield', 'Minimo',
      'Mosaic', 'Netscape',
      'Obigo', 'Orca',
      'Oregano', 'Otter',
      'Perk', 'Phoenix', 'Podkicker',
      'Ryouko', 'Sleipnir',
      'Shiira', 'Skyfire',
      'Stainless', 'Sundance', 'Sunrise',
      'Surf', 'Swiftfox', 'Swiftweasel',
      'Thunderbird', 'Tizen',
      'Tjusig', 'UC?\ ?Browser|UCWEB',
      'polarity', 'polaris', 'pogo', 'prism', 'superbird', 'songbird',
      'Usejump', 'Vivaldi', 'Wyzo',
    ];

    var defaultBrowserList = {
      "360se": {
        title: "360 Explorer"
      },
      "360ee": {
        title: "360 Chrome",
        image: "360se"
      },
      "360 aphone browser": {
        title: "360 Aphone Browser",
        image: "360se"
      },
      "abolimba": {
        title: "Abolimba"
      },
      "acoo browser": {
        title: "{%Acoo Browser%}",
        image: "acoobrowser"
      },
      "amiga-aweb": {
        title: "Amiga {%AWeb%}",
        image: "amiga-aweb"
      },
      "antfresco": {
        title: "ANT {%Fresco%}"
      },
      "mrchrome": {
        title: "Amigo",
        image: "amigo"
      },
      "myibrow": {
        title: "{%myibrow%}",
        image: "my-internet-browser"
      },
      "america online browser": {
        title: "{%America Online Browser%}",
        image: "aol"
      },
      "amigavoyager": {
        title: "Amiga {%Voyager%}"
      },
      "aol": {
        upper: [0, 1, 2], // AOL
      },
      "atomicbrowser": {
        upper: [0, 6], // AtomicBrowser
        image: "atomicwebbrowser"
      },
      "barcapro": {
        title: "{%BarcaPro%}",
        image: "barca"
      },
      "baidubrowser": {
        image: "bidubrowser"
      },
      "baiduhd": {
        title: "{%BaiduHD%}",
        image: "bidubrowser"
      },
      "blackhawk": {
        upper: [0, 5] //BlackHawk
      },
      "bonecho": {
        title: "{%BonEcho%}",
        image: "firefoxdevpre"
      },
      "browsex": {
        upper: [0, 6] // BrowseX
      },
      "cayman browser": {
        title: "{%Cayman Browser%}",
        image: "caymanbrowser"
      },
      "charon": {
        image: "null"
      },
      "cheshire": {
        image: "aol"
      },
      "chimera": {
        image: "null"
      },
      "chromeframe": {
        image: "chrome"
      },
      "chromeplus": {
        title: "{%ChromePlus%}"
      },
      "iron": {
        title: "SRWare {%Iron%}",
        image: "srwareiron"
      },
      "cometbird": {
        upper: [0, 5]
      },
      "comodo_dragon": {
        title: "Comodo {%Dragon%}",
        image: "comodo-dragon"
      },
      "coolnovo": {
        upper: [0, 4]
      },
      "corom": {
        upper: [0, 2] // CoRom
      },
      "crazy browser": {
        upper: [0, 6],
        image: "crazybrowser"
      },
      "crmo": {
        upper: [0, 2], // CrMo
        image: "chrome"
      },
      "dplus": {
        upper: [0, 1], // DPlus
        image: "dillo"
      },
      "deepnet explorer": {
        upper: [0, 8],
        image: "deepnetexplorer"
      },
      "deskbrowse": {
        upper: [0, 4],
      },
      "docomo": {
        upper: [0, 2, 4], // DoCoMo
        image: "null"
      },
      "doczilla": {
        upper: [0, 3],
      },
      "dolfin": {
        image: "samsung"
      },
      "dorothy": {
        image: "dorothybrowser"
      },
      "element browser": {
        upper: [0, 8],
        image: "elementbrowser"
      },
      "enigma browser": {
        upper: [0, 7],
        image: "enigmabrowser"
      },
      "enigmafox": {
        upper: [0, 6],
        image: "null"
      },
      "epic": {
        image: "epicbrowser"
      },
      "escape": {
        image: "espialtvbrowser"
      },
      "espial": {
        image: "espialtvbrowser"
      },
      "fireweb navigator": {
        upper: [0, 8],
        image: "firewebnavigator"
      },
      "globalmojo": {
        upper: [0, 6]
      },
      "gobrowser": {
        upper: [0, 1, 2]
      },
      "google wireless transcoder": {
        title: "Google Wireless Transcoder",
        image: "google"
      },
      "gosurf": {
        upper: [0, 2]
      },
      "granparadiso": {
        upper: [0, 4],
        image: "firefoxdevpre"
      },
      "greenbrowser": {
        upper: [0, 5]
      },
      "gsa": {
        upper: [0, 1, 2],
        image: "google"
      },
      "hotjava": {
        upper: [0, 3]
      },
      "hydra browser": {
        title: "Hydra Browser",
        image: "hydrabrowser"
      },
      "ibm webexplorer": {
        title: "IBM {%WebExplorer%}",
        image: "ibmwebexplorer"
      },
      "juzibrowser": {
        upper: [0, 4]
      },
      "miuibrowser": {
        upper: [0, 4]
      },
      "mxnitro": {
        upper: [0, 2]
      },
      "ibrowse": {
        upper: [0, 1]
      },
      "icab": {
        upper: [1]
      },
      "icebrowser": {
        upper: [0, 3]
      },
      "icecat": {
        title: "GNU {%IceCat%}"
      },
      "icedragon": {
        upper: [0, 3]
      },
      "iceweasel": {
        upper: [0, 3]
      },
      "inet browser": {
        upper: [1, 5],
        image: "null"
      },
      "irider": {
        upper: [1]
      },
      "internetsurfboard": {
        upper: [0, 8],
      },
      "jasmine": {
        image: "samsung"
      },
      "k-meleon": {
        upper: [0, 2],
        image: "kmeleon"
      },
      "k-ninja": {
        upper: [0, 2],
        image: "kninja"
      },
      "strata": {
        title: "Kirix {%Strata%}",
        image: "kirix-strata"
      },
      "kkman": {
        upper: [0, 1]
      },
      "kmail": {
        upper: [0, 1]
      },
      "kmlite": {
        upper: [0, 1, 2],
        image: "kmeleon"
      },
      "lbrowser": {
        upper: [0, 1]
      },
      "links": {
        image: "null"
      },
      "lbbrowser": {
        title: "Liebao Browser"
      },
      "liebaofast": {
        image: "lbbrowser"
      },
      "leechcraft": {
        title: "LeechCraft",
        image: "null"
      },
      "lobo": {
        upper: [0]
      },
      "lorentz": {
        upper: [0],
        image: "firefoxdevpre"
      },
      "maemo browser": {
        upper: [0, 6],
        image: "maemo"
      },
      " mib/": {
        title: "{%MIB%}",
        image: "mib"
      },
      "micromessenger": {
        upper: [0, 5],
        image: "wechat"
      },
      "minibrowser": {
        upper: [0, 5]
      },
      "mozilladeveloperpreview": {
        title: "{%MozillaDeveloperPreview%}",
        image: "firefoxdevpre"
      },
      "mqqbrowser": {
        upper: [0, 1, 2, 3], // MQQBrowser
        image: "qqbrowser"
      },
      "multi-browser": {
        upper: [0, 6],
        image: "multi-browserxp"
      },
      "multizilla": {
        upper: [0, 5],
        image: "mozilla"
      },
      "myie2": {
        upper: [0, 2, 3]
      },
      "namoroka": {
        image: "firefoxdevpre"
      },
      "navigator": {
        title: "Netscape {%Navigator%}",
        image: "netscape"
      },
      "netbox": {
        upper: [0, 3]
      },
      "netcaptor": {
        upper: [0, 3]
      },
      "netfront": {
        upper: [0, 3]
      },
      "netnewswire": {
        upper: [0, 3, 7]
      },
      "netpositive": {
        upper: [0, 3]
      },
      "netsurf": {
        upper: [0, 3]
      },
      "nf-browser": {
        upper: [0, 1, 2, 4],
        image: "netfront"
      },
      "nichrome/self": {
        title: "{%Nichrome/self%}",
        image: "nichromeself"
      },
      "nokiabrowser": {
        title: "Nokia {%Browser%}",
        image: "nokia"
      },
      "novarra-vision": {
        title: "Novarra {%Vision%}",
        image: "novarra"
      },
      "offbyone": {
        title: "Off By One"
      },
      "omniweb": {
        upper: [0, 4]
      },
      "onebrowser": {
        upper: [0, 3]
      },
      "origyn web browser": {
        title: "Oregano Web Browser",
        image: "owb"
      },
      "osb-browser": {
        image: "null"
      },
      " pre/": {
        title: "Palm {%Pre%}",
        image: "palmpre"
      },
      "palemoon": {
        title: "Pale {%Moon%}"
      },
      "patriott::browser": {
        title: "Patriott {%Browser%}",
        image: "patriott"
      },
      "phaseout": {
        title: "Phaseout"
      },
      "playstation 4": {
        title: "PS4 Web Browser",
        image: "webkit"
      },
      "podkicker pro": {
        upper: [0, 8],
        image: "podkicker"
      },
      "qqbrowser": {
        upper: [0, 1, 2]
      },
      "qtweb internet browser": {
        title: "{%QtWeb Internet Browser%}",
        image: "qtwebinternetbrowser"
      },
      "qtcarbrowser": {
        image: "tesla"
      },
      "qupzilla": {
        upper: [0, 3]
      },
      "rekonq": {
        title: "rekonq"
      },
      "retawq": {
        image: "terminal"
      },
      "rockmelt": {
        upper: [0, 4]
      },
      "saayaa": {
        title: "SaaYaa Explorer"
      },
      "seamonkey": {
        upper: [0, 3]
      },
      "semc-browser": {
        upper: [0, 1, 2, 3, 5],
        image: "semcbrowser"
      },
      "semc-java": {
        upper: [0, 1, 2, 3],
        image: "semcbrowser"
      },
      "shiretoko": {
        upper: [0],
        image: "firefoxdevpre"
      },
      "sitekiosk": {
        upper: [0, 4]
      },
      "skipstone": {
        upper: [0, 4]
      },
      "silk": {
        title: "Amazon {%Silk%}"
      },
      "slimboat": {
        upper: [0, 4]
      },
      "slimbrowser": {
        upper: [0, 4]
      },
      "smarttv": {
        upper: [0, 5, 6],
        image: "maplebrowser"
      },
      "substream": {
        upper: [0, 3]
      },
      "sulfur": {
        title: "Flock {%Sulfur%}",
        image: "flock"
      },
      "sylera": {
        upper: [0],
        image: "null"
      },
      "taobrowser": {
        upper: [0, 3],
      },
      "tear": {
        title: "Tear"
      },
      "teashark": {
        upper: [0, 3]
      },
      "teleca": {
        image: "obigo"
      },
      "tencenttraveler": {
        title: "Tencent {%Traveler%}"
      },
      "tenfourfox": {
        upper: [0, 3, 7]
      },
      "theworld": {
        title: "TheWorld Browser"
      },
      "ubrowser": {
        upper: [0, 1],
        image: "ucbrowser"
      },
      "ucbrowser": {
        upper: [0, 1, 2, 3],
      },
      "uc browser": {
        upper: [0, 1, 2, 4],
        image: "ucbrowser"
      },
      "ucweb": {
        upper: [0, 1, 2, 3, 4],
        image: "ucbrowser"
      },
      "ultrabrowser": {
        upper: [0, 5],
      },
      "up.browser": {
        upper: [0, 3],
        image: "openwave"
      },
      "up.link": {
        upper: [0, 3],
        image: "openwave"
      },
      "uzardweb": {
        title: "{%uZardWeb%}"
      },
      "uzard": {
        upper: [1],
        image: "uzardweb"
      },
      "uzbl": {
        title: "uzbl"
      },
      "vimprobable": {
        upper: [0],
        image: "null"
      },
      "vonkeror": {
        upper: [0],
        image: "null"
      },
      "w3m": {
        upper: [0, 2]
      },
      "wget": {
        image: "null"
      },
      "curl": {
        image: "null"
      },
      "iemobile": {
        upper: [0, 1, 2],
        image: "msie-mobile"
      },
      "waterfox": {
        upper: [0, 5]
      },
      "webianshell": {
        title: "Webian {%Shell%}"
      },
      "webrender": {
        upper: [0]
      },
      "weltweitimnetzbrowser": {
        title: "Weltweitimnetz {%Browser%}",
        image: "weltweitimnetzbrowser"
      },
      "whitehat aviator": {
        upper: [0, 5, 9],
        image: "aviator"
      },
      "wkiosk": {
        title: "wKiosk"
      },
      "worldwideweb": {
        upper: [0, 5, 9]
      },
      "x-smiles": {
        upper: [0, 2]
      },
      "xiino": {
        image: "null"
      },
      "yabrowser": {
        upper: [0, 2],
        image: "yandex"
      },
      "zbrowser": {
        upper: [1]
      },
      "zipzap": {
        upper: [0, 3]
      },
      "abrowse": {
        title: "{%ABrowse Browser%}"
      },
      "none": {
        title: "Unknown",
        image: "unknown"
      }
    };
    var browserRegEx = new RegExp(browserList.concat(Object.keys(defaultBrowserList)).join("|"), "i");

    var displayNameList = {
      "msie": {
        callback: function (rep, ret) {
          if (ret.version == "7.0" && /Trident\/4.0/i.test(ret.ua)) {
            ret.name = " 8.0 (Compatibility Mode)";
            ret.version = "";
          } else {
            ret.name = "";
          }
        }
      },
      "nf-browser": {
        name: "NetFront"
      },
      "semc-browser": {
        name: "SEMC Browser"
      },
      "ucweb": {
        name: "UC Browser"
      },
      "ubrowser": {
        name: "UC Browser"
      },
      "ucbrowser": {
        name: "UC Browser"
      },
      "uc browser": {
        name: "UC Browser"
      },
      "bidubrowser": {
        name: "Baidu Browser"
      },
      "baidubrowser": {
        name: "Baidu Browser"
      },
      "baiduhd": {
        name: "Baidu Browser"
      },
      "up.browser": {
        name: "Openwave Mobile Browser"
      },
      "up.link": {
        name: "Openwave Mobile Browser"
      },
      "chromeframe": {
        name: "Google Chrome Frame"
      },
      "mozilladeveloperpreview": {
        name: "Mozilla Developer Preview"
      },
      "opera mobi": {
        name: "Opera Mobile"
      },
      "osb-browser": {
        name: "Gtk+ WebCore"
      },
      "tablet browser": {
        name: "MicroB"
      },
      "crmo": {
        name: "Chrome Mobile"
      },
      "smarttv": {
        name: "Maple Browser"
      },
      "atomicbrowser": {
        name: "Atomic Web Browser"
      },
      "dplus": {
        name: "D+"
      },
      "micromessenger": {
        name: "WeChat"
      },
      "nichrome/self": {
        name: "NiChrome"
      },
      "gsa": {
        name: "Google Search App"
      },
      "opera labs": {
        callback: function (rep, ret) {
          rep = ret.ua.match(/Edition\ Labs([\ ._0-9a-zA-Z]+);/i);
          if (rep !== null) {
            ret.version = rep[1];
          } else {
            ret.version = "";
          }
        }
      },
      "qtcarbrowser": {
        name: "Tesla Car Browser",
        version: ""
      },
      "iceweasel": {
        callback: function (rep, ret) {
          if (ret.version == "Firefox") {
            ret.version = "";
          }
        }
      },
      "yabrowser": {
        callback: function (rep, ret) {
          ret.name = "Yandex.Browser";
        }
      }
    };
    var setRetName = function (ret, rep) {
      ret.image = rep.image;
      ret.full = rep.title.replace(/\{\%(.+)\%\}/, function (match, p1) {
        return getVersion(ret, p1);
      });
    };
    var getVersion = function (ret, title) {
      var lowerTitle = title.toLowerCase();
      var start = lowerTitle;
      ret.name = title;

      if ((lowerTitle == "opera" || lowerTitle == "opera next" || lowerTitle == "opera developer") && /OPR/i.test(ret.ua)) {
        start = "OPR";
      } else if (
        ((lowerTitle == "opera" || lowerTitle == "opera next" || lowerTitle == "opera labs") && /Version/i.test(ret.ua)) ||
        ((lowerTitle == "opera mobi" && /Version/i.test(ret.ua))) ||
        ((lowerTitle == "safari" && /Version/i.test(ret.ua))) ||
        ((lowerTitle == "pre" && /Version/i.test(ret.ua))) ||
        ((lowerTitle == "android webkit"))
      ) {
        start = "Version";
      } else if (lowerTitle == "links") {
        start = "Links (";
      } else if (lowerTitle == "smarttv") {
        start = "WebBrowser";
      } else if (lowerTitle == "ucweb" && /UCBrowser/i.test(ret.ua)) {
        start = "UCBrowser";
      } else if (
        lowerTitle == "tenfourfox" ||
        lowerTitle == "classilla" ||
        lowerTitle == "msie" && /\ rv:([.0-9a-zA-Z]+)/i.test(ret.ua)
      ) {
        // We have IE11 or newer
        start = " rv";
      } else if (lowerTitle == "nichrome/self") {
        start = "self";
      }
      start = start.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\-]', 'g'), '\\$&');
      var regEx = new RegExp(start + '[\ |\/|\:]?([.0-9a-zA-Z]+)', 'i');
      var rep = ret.ua.match(regEx);
      if (rep !== null) {
        ret.version = rep[1];
      } else {
        ret.version = "";
      }

      if (ret.version.toLowerCase() == "build") { // To Fix some ua like 'Amazon Otter Build/KTU84M'
        ret.version = "";
      }
      if (lowerTitle in displayNameList) {
        if ('callback' in displayNameList[lowerTitle]) {
          displayNameList[lowerTitle].callback(rep, ret);
        } else {
          for (var tempVar in displayNameList[lowerTitle]) {
            ret[tempVar] = displayNameList[lowerTitle][tempVar];
          }
        }
      }

      return ret.name + (ret.version !== "" ? (" " + ret.version) : "");
    };

    var analyze = function (uaString) {
      var ret = {
        ua: uaString,
        name: "",
        version: "",
        full: "",
        image: "",
        dir: "browser"
      };
      var res = uaString.match(browserRegEx);
      var rep = null;
      if (res !== null) {
        var name = res[0].toLowerCase();
        var upper = null;

        rep = {};
        if (!!defaultBrowserList[name]) {
          Object.keys(defaultBrowserList[name]).forEach(function (key) {
            if (key !== 'upper') {
              rep[key] = defaultBrowserList[name][key];
            } else {
              upper = defaultBrowserList[name].upper;
            }
          });
        }
        if (!('title' in rep)) {
          if (upper !== null) {
            var upperTitle = name;
            upper.forEach(function (letterId) {
              upperTitle = upperTitle.substr(0, letterId) + upperTitle.substr(letterId, 1).toUpperCase() + upperTitle.substr(letterId + 1, upperTitle.length); // fuck IE
            });
            rep.title = "{%" + upperTitle + "%}";
          } else {
            rep.title = "{%" + name.toLowerCase().replace(/[a-z]/, function (m) {
              return m.toUpperCase(); // Repeat dirty code...
            }) + "%}";
          }
        }
        if (!('image' in rep)) {
          rep.image = name;
        }
        setRetName(ret, rep);
      } else if (/QQ(?!Download|Pinyin)/.test(ret.ua)) {
        ret.full = getVersion(ret, "QQ");
        ret.image = "qq";
      } else if (/Galaxy/i.test(ret.ua) && !/Chrome/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Galaxy');
        ret.image = "galaxy";
      } else if (/Opera Mini/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Opera Mini');
        ret.image = "opera-2";
      } else if (/Opera Mobi/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Opera Mobi');
        ret.image = "opera-2";
      } else if (/Opera/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Opera');
        ret.image = "opera-1";
        if (/Version/i.test(ret.ua)) {
          ret.image = "opera-2";
        }
      } else if (/OPR/i.test(ret.ua)) {
        if (/(Edition Next)/i.test(ret.ua)) {
          ret.full = getVersion(ret, 'Opera Next');
          ret.image = "opera-next";
        } else if (/(Edition Developer)/i.test(ret.ua)) {
          ret.full = getVersion(ret, 'Opera Developer');
          ret.image = "opera-developer";
        } else {
          ret.full = getVersion(ret, 'Opera');
          ret.image = "opera-1";
        }
      } else if (/SE\ /i.test(ret.ua) && /MetaSr/i.test(ret.ua)) {
        ret.name = ret.full = "Sogou Explorer";
        ret.image = "sogou";
      } else if ((/Ubuntu\;\ Mobile/i.test(ret.ua) || /Ubuntu\;\ Tablet/i.test(ret.ua) &&
        /WebKit/i.test(ret.ua))) {
        ret.name = ret.full = "Ubuntu Web Browser";
        ret.image = "ubuntuwebbrowser";
      } else if (/Avant\ Browser/i.test(ret.ua)) { // Fuck it
        ret.full = "Avant " + getVersion(ret, 'Browser');
        ret.image = "avantbrowser";
      } else if (/AppleWebkit/i.test(ret.ua) && /Android/i.test(ret.ua) && !/Chrome/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Android Webkit');
        ret.image = "android-webkit";
      } else if (/Windows.+Chrome.+Edge/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Edge');
        ret.image = "edge";
      } else if (/Chrome|crios/i.test(ret.ua)) {
        if (/crios/i.test(ret.ua)) {
          ret.full = "Google " + getVersion(ret, 'CriOS');
          ret.image = "chrome";
        } else {
          ret.full = "Google " + getVersion(ret, 'Chrome');
          ret.image = "chrome";
        }
      } else if (/Nokia/i.test(ret.ua) && !/Trident/i.test(ret.ua)) {
        ret.full = "Nokia Web Browser";
        ret.image = "maemo";
      } else if (/Safari/i.test(ret.ua)) {
        ret.name = "Safari";
        if (/Version/i.test(ret.ua)) {
          ret.full = getVersion(ret, 'Safari');
        } else {
          ret.full = ret.name;
        }
        if (/Mobile ?Safari/i.test(ret.ua)) {
          ret.name = "Mobile " + ret.name;
          ret.full = "Mobile " + ret.full;
        }
        ret.image = "safari";
      } else if (/Firefox/i.test(ret.ua)) {
        ret.full = getVersion(ret, 'Firefox');
        ret.image = "firefox";
      } else if (/MSIE/i.test(ret.ua) || /Trident/i.test(ret.ua)) {
        ret.full = "Internet Explorer" + getVersion(ret, 'MSIE');
        ret.image = "msie";
        rep = ret.ua.match(/(MSIE[\ |\/]?| rv:)([.0-9a-zA-Z]+)/i);
        if (rep !== null) {
          var ieVersion = parseInt(rep[2]);
          if (ieVersion >= 11) {
            ret.image = "msie11";
          } else if (ieVersion >= 10) {
            ret.image = "msie10";
          } else if (ieVersion >= 9) {
            ret.image = "msie9";
          } else if (ieVersion >= 7) {
            ret.image = "msie7";
          } else if (ieVersion >= 6) {
            ret.image = "msie6";
          } else if (ieVersion >= 4) {
            ret.image = "msie4";
          } else if (ieVersion >= 3) {
            ret.image = "msie3";
          } else if (ieVersion >= 2) {
            ret.image = "msie2";
          }
        }
      } else if (/Mozilla/i.test(ret.ua)) {
        ret.full = "Mozilla Compatible";
        ret.image = "mozilla";
      } else {
        ret.name = "Unknown";
        ret.image = "null";
        ret.full = ret.name;
      }
      return ret;
    };

    var analyzeResult = analyze(uaString);

    if (analyzeResult.full === "Unknown") {
      console.log(uaString); //问题uaString 输出控制台

      var tryParse = function (uaString) {
        var regex = /(\S+)\s(\(.+\))?\s?(\S*)/i;
        var result = uaString;

        var resultArray = regex.exec(uaString);
        if (resultArray !== null) {
          result = resultArray[1];
        }
        return result.replace(/\//ig, " ");
      };
      return tryParse(uaString);
    } else if (analyzeResult.full === "Mozilla Compatible") {
      var tryParse = function (uaString) {
        var regex = /(\S+)\s(\(.+\))?\s?(\S*)/i;
        var result = uaString;

        var resultArray = regex.exec(uaString);
        if (resultArray !== null) {
          if (typeof resultArray[3] !== "undefined") {
            result = resultArray[3];
          } else {
            result = "Mozilla Compatible";
          }
        }
        return result.replace(/\//ig, " ");
      };
      return tryParse(uaString);
    }


    return analyzeResult.full;
  };

  var getOSText = function (OSResult) {
    var result = {};
    if ((/win/i).test(OSResult)) {
      result.os = 'windows';
      result.icon = 'windows';
    } else if ((/android/i).test(OSResult)) {
      result.os = 'android';
      result.icon = 'android';
    } else if ((/ubuntu/i).test(OSResult)) {
      result.os = 'ubuntu';
      result.icon = 'linux';
    } else if ((/linux/i).test(OSResult)) {
      result.os = 'linux';
      result.icon = 'linux';
    } else if ((/(Mac|iOS)/i).test(OSResult)) {
      result.os = 'apple';
      result.icon = 'apple';
    } else if ((/unix/i).test(OSResult)) {
      result.os = 'unix';
      result.icon = 'desktop';
    } else if ((/symbian/i).test(OSResult)) {
      result.os = 'symbian';
      result.icon = 'mobile';
    } else {
      result.os = 'other';
      result.icon = 'desktop';
    }
    return result;
  };

  var getBrowserText = function (BrowserResult) {
    var result = {};
    if ((/firefox/i).test(BrowserResult)) {
      result.browser = result.icon = 'firefox'
    } else if ((/maxthon/i).test(BrowserResult)) {
      result.browser = 'maxthon';
      result.icon = 'globe';
    } else if ((/360/i).test(BrowserResult)) {
      result.browser = '360';
      result.icon = 'globe';
    } else if ((/baidu/i).test(BrowserResult)) {
      result.browser = 'baidu';
      result.icon = 'globe';
    } else if ((/UC\sBrowser/i).test(BrowserResult)) {
      result.browser = 'ucweb';
      result.icon = 'globe';
    } else if ((/sogou/i).test(BrowserResult)) {
      result.browser = 'sogou';
      result.icon = 'globe';
    } else if ((/2345explorer/i).test(BrowserResult)) {
      result.browser = '2345explorer';
      result.icon = 'globe';
    } else if ((/2345chrome/i).test(BrowserResult)) {
      result.browser = '2345chrome';
      result.icon = 'globe';
    } else if ((/liebao/i).test(BrowserResult)) {
      result.browser = 'lbbrowser';
      result.icon = 'globe';
    } else if ((/wechat/i).test(BrowserResult)) {
      result.browser = 'wechat';
      result.icon = 'weixin';
    } else if ((/QQ/i).test(BrowserResult)) {
      result.browser = 'qq';
      result.icon = 'globe';
    } else if ((/miui/i).test(BrowserResult)) {
      result.browser = 'mi';
      result.icon = 'globe';
    } else if ((/chrome/i).test(BrowserResult)) {
      result.browser = result.icon = 'chrome';
    } else if ((/safari/i).test(BrowserResult)) {
      result.browser = 'apple';
      result.icon = 'safari';
    } else if ((/opera/i).test(BrowserResult)) {
      result.browser = result.icon = 'opera';
    } else if ((/internet\sexplorer/i).test(BrowserResult)) {
      result.browser = 'ie';
      result.icon = 'internet-explorer';
    } else if ((/edge/i).test(BrowserResult)) {
      result.browser = 'ie';
      result.icon = 'edge';
    } else {
      result.browser = 'other';
      result.icon = 'globe';
    }
    return result;
  }
  return {
    isAdmin: isAdmin,
    isMobile: checkMobile(),
    hasOSSpan: function(UAString){
      return regexMatch(OSRegexs, UAString);
    },
    hasDeviceSpan: function(UAString){
      return regexMatch(deviceRegexs, UAString);      
    },
    BrowserDetect: BrowserDetect,
    getOSText: getOSText,
    getBrowserText: getBrowserText,
  };
})();




! function (t, e, s) {
  if (!t.DUOSHUO) {
    for (var i in Object.prototype) return alert("Object.prototype 不为空，请不要给 Object.prototype 设置方法");
    ! function (t, e, s) {
      "use strict";
      var i = t._ = {},
        o = e.getElementsByTagName("head")[0] || e.getElementsByTagName("body")[0];
      i.extend = function (t, e) {
        for (var s in e) t[s] = e[s];
        return t
      }, i.each = function (t, e) {
        for (var s = 0; s < t.length; s++) e(t[s])
      }, i.injectStylesheet = function (t, s) {
        var i = e.createElement("link");
        i.type = "text/css", i.rel = "stylesheet", i.href = t, s && (i.onload = s), o.appendChild(i)
      }, i.injectScript = function (i, o) {
        var n = e.createElement("script"),
          a = e.head || e.getElementsByTagName("head")[0] || e.documentElement;
        n.type = "text/javascript", n.src = i, n.async = "async", n.charset = "utf-8", o && (n.onload = n.onreadystatechange = function (e, i) {
          var r = i || !n.readyState || /loaded|complete/.test(n.readyState);
          r && (n.onload = n.onreadystatechange = null, a && n.parentNode && a.removeChild(n), n = s, i || o.call(t))
        }), a.insertBefore(n, a.firstChild)
      }, i.injectStyle = function (t) {
        var s = e.createElement("style");
        return s.type = "text/css", o.appendChild(s), t = t.replace(/\}/g, "}\n"), s.styleSheet ? s.styleSheet.cssText = t : s.appendChild(e.createTextNode(t)), s
      }, i.getCookie = function (t) {
        for (var i, o, n, a = " " + t + "=", r = e.cookie.split(";"), d = 0; d < r.length; d++)
          if (i = " " + r[d], o = i.indexOf(a), o >= 0 && o + a.length == (n = i.indexOf("=") + 1)) return decodeURIComponent(i.substring(n, i.length).replace(/\+/g, ""));
        return s
      }, i.param = function (t) {
        var e = [];
        for (var i in t) t[i] != s && e.push(i + "=" + encodeURIComponent(t[i]));
        return e.join("&")
      }, i.cssProperty = function (t, s) {
        var i = (e.body || e.documentElement).style;
        if ("undefined" == typeof i) return !1;
        if ("string" == typeof i[t]) return s ? t : !0;
        for (var o = ["Moz", "Webkit", "ms"], t = t.charAt(0).toUpperCase() + t.substr(1), n = 0; n < o.length; n++)
          if ("string" == typeof i[o[n] + t]) return s ? o[n] + t : !0
      }
    }(t, e);
    var o = ("https:" == e.location.protocol ? "https:" : "http:") + "//static.duoshuo.com";
    if (e.all && !e.addEventListener) return t._.injectScript(o + "/embed-classic.unstable.js"), !1;
    ! function (t) {
      function s(t) {
        var e = {
            val: t
          },
          s = t.split(/\s+in\s+/);
        return s[1] && (e.val = D(0) + s[1], s = s[0].slice(D(0).length).trim().split(/,\s*/), e.key = s[0], e.pos = s[1]), e
      }

      function i(t, e, s) {
        var i = {};
        return i[t.key] = e, t.pos && (i[t.pos] = s), i
      }

      function o(t, e, o) {
        function n(t, e, s) {
          p.splice(t, 0, e), m.splice(t, 0, s)
        }
        h(t, "each");
        var a, d = t.outerHTML,
          c = t.previousSibling,
          l = t.parentNode,
          p = [],
          m = [];
        o = s(o), e.one("update", function () {
          l.removeChild(t)
        }).one("premount", function () {
          l.stub && (l = e.root)
        }).on("update", function () {
          var t = H(o.val, e);
          if (t) {
            if (!Array.isArray(t)) {
              var s = JSON.stringify(t);
              if (s == a) return;
              a = s, u(m, function (t) {
                t.unmount()
              }), p = [], m = [], t = Object.keys(t).map(function (e) {
                return i(o, e, t[e])
              })
            }
            u(p, function (e) {
              if (e instanceof Object) {
                if (t.indexOf(e) > -1) return
              } else {
                var s = O(t, e),
                  i = O(p, e);
                if (s.length >= i.length) return
              }
              var o = p.indexOf(e),
                n = m[o];
              return n ? (n.unmount(), p.splice(o, 1), m.splice(o, 1), !1) : void 0
            });
            var h = [].indexOf.call(l.childNodes, c) + 1;
            u(t, function (s, c) {
              var u = t.indexOf(s, c),
                f = p.indexOf(s, c);
              if (0 > u && (u = t.lastIndexOf(s, c)), 0 > f && (f = p.lastIndexOf(s, c)), !(s instanceof Object)) {
                var g = O(t, s),
                  v = O(p, s);
                g.length > v.length && (f = -1)
              }
              var b = l.childNodes;
              if (0 > f) {
                if (!a && o.key) var y = i(o, s, u);
                var _ = new r({
                  tmpl: d
                }, {
                  before: b[h + u],
                  parent: e,
                  root: l,
                  item: y || s
                });
                return _.mount(), n(u, s, _), !0
              }
              return o.pos && m[f][o.pos] != u && (m[f].one("update", function (t) {
                t[o.pos] = u
              }), m[f].update()), u != f ? (l.insertBefore(b[h + f], b[h + (u > f ? u + 1 : u)]), n(u, p.splice(f, 1)[0], m.splice(f, 1)[0])) : void 0
            }), p = t.slice()
          }
        })
      }

      function n(t, e, s) {
        v(t, function (t) {
          if (1 == t.nodeType) {
            t.parentNode && t.parentNode.isLoop && (t.isLoop = 1), t.getAttribute("each") && (t.isLoop = 1);
            var i = U(t);
            if (i && !t.isLoop) {
              for (var o, n = new r(i, {
                  root: t,
                  parent: e
                }, t.innerHTML), a = i.name, d = e; !U(d.root) && d.parent;) d = d.parent;
              n.parent = d, o = d.tags[a], o ? (Array.isArray(o) || (d.tags[a] = [o]), d.tags[a].push(n)) : d.tags[a] = n, t.innerHTML = "", s.push(n)
            }
            u(t.attributes, function (s) {
              /^(name|id)$/.test(s.name) && (e[s.value] = t)
            })
          }
        })
      }

      function a(t, e, s) {
        function i(t, e, i) {
          if (e.indexOf(D(0)) >= 0) {
            var o = {
              dom: t,
              expr: e
            };
            s.push(p(o, i))
          }
        }
        v(t, function (t) {
          var s = t.nodeType;
          if (3 == s && "STYLE" != t.parentNode.tagName && i(t, t.nodeValue), 1 == s) {
            var n = t.getAttribute("each");
            return n ? (o(t, e, n), !1) : (u(t.attributes, function (e) {
              var s = e.name,
                o = s.split("__")[1];
              return i(t, e.value, {
                attr: o || s,
                bool: o
              }), o ? (h(t, s), !1) : void 0
            }), U(t) ? !1 : void 0)
          }
        })
      }

      function r(t, e, s) {
        function i() {
          u(Object.keys(k), function (t) {
            c[t] = H(k[t], m || d)
          })
        }

        function o(t) {
          if (u(v, function (e) {
              e[t ? "mount" : "unmount"]()
            }), m) {
            var e = t ? "on" : "off";
            m[e]("update", d.update)[e]("unmount", d.unmount)
          }
        }
        var r, d = w.observable(this),
          c = _(e.opts) || {},
          h = g(t.tmpl),
          m = e.parent,
          f = [],
          v = [],
          y = e.root,
          O = e.item,
          U = t.fn,
          S = y.tagName.toLowerCase(),
          k = {};
        U && y._tag && y._tag.unmount(!0), y._tag = this, this._id = ~~((new Date).getTime() * Math.random()), p(this, {
          parent: m,
          root: y,
          opts: c,
          tags: {}
        }, O), u(y.attributes, function (t) {
          k[t.name] = t.value
        }), h.innerHTML && !/select/.test(S) && (h.innerHTML = b(h.innerHTML, s)), this.update = function (t) {
          p(d, t, O), i(), d.trigger("update", O), l(f, d, O), d.trigger("updated")
        }, this.mount = function () {
          if (i(), U && U.call(d, c), o(!0), a(h, d, f), d.parent || d.update(), d.trigger("premount"), U)
            for (; h.firstChild;) y.appendChild(h.firstChild);
          else r = h.firstChild, y.insertBefore(r, e.before || null);
          y.stub && (d.root = y = m.root), d.trigger("mount")
        }, this.unmount = function (t) {
          var e = U ? y : r,
            s = e.parentNode;
          if (s) {
            if (m) Array.isArray(m.tags[S]) ? u(m.tags[S], function (t, e) {
              t._id == d._id && m.tags[S].splice(e, 1)
            }) : delete m.tags[S];
            else
              for (; e.firstChild;) e.removeChild(e.firstChild);
            t || s.removeChild(e)
          }
          d.trigger("unmount"), o(), d.off("*"), y._tag = null
        }, n(h, this, v)
      }

      function d(e, s, i, o, n) {
        i[e] = function (e) {
          e = e || t.event, e.which = e.which || e.charCode || e.keyCode, e.target = e.target || e.srcElement, e.currentTarget = i, e.item = n, s.call(o, e) === !0 || /radio|check/.test(i.type) || (e.preventDefault && e.preventDefault(), e.returnValue = !1);
          var a = n ? o.parent : o;
          a.update()
        }
      }

      function c(t, e, s) {
        t && (t.insertBefore(s, e), t.removeChild(e))
      }

      function l(t, s, i) {
        u(t, function (t) {
          var o = t.dom,
            n = t.attr,
            a = H(t.expr, s),
            r = t.dom.parentNode;
          if (null == a && (a = ""), r && "TEXTAREA" == r.tagName && (a = a.replace(/riot-/g, "")), t.value !== a) {
            if (t.value = a, !n) return o.nodeValue = a;
            if (h(o, n), "function" == typeof a) d(n, a, o, s, i);
            else if ("if" == n) {
              var l = t.stub;
              a ? l && c(l.parentNode, l, o) : (l = t.stub = l || e.createTextNode(""), c(o.parentNode, o, l))
            } else if (/^(show|hide)$/.test(n)) "hide" == n && (a = !a), o.style.display = a ? "" : "none";
            else if ("value" == n) o.value = a;
            else if ("riot-" == n.slice(0, 5)) n = n.slice(5), a ? o.setAttribute(n, a) : h(o, n);
            else {
              if (t.bool) {
                if (o[n] = a, !a) return;
                a = n
              }
              "object" != typeof a && o.setAttribute(n, a)
            }
          }
        })
      }

      function u(t, e) {
        for (var s, i = 0, o = (t || []).length; o > i; i++) s = t[i], null != s && e(s, i) === !1 && i--;
        return t
      }

      function h(t, e) {
        t.removeAttribute(e)
      }

      function p(t, e, s) {
        return e && u(Object.keys(e), function (s) {
          t[s] = e[s]
        }), s ? p(t, s) : t
      }

      function m() {
        if (t) {
          var e = navigator.userAgent,
            s = e.indexOf("MSIE ");
          return s > 0 ? parseInt(e.substring(s + 5, e.indexOf(".", s)), 10) : 0
        }
      }

      function f(t, s) {
        var i = e.createElement("option"),
          o = /value=[\"'](.+?)[\"']/,
          n = /selected=[\"'](.+?)[\"']/,
          a = s.match(o),
          r = s.match(n);
        i.innerHTML = s, a && (i.value = a[1]), r && i.setAttribute("riot-selected", r[1]), t.appendChild(i)
      }

      function g(t) {
        var s = t.trim().slice(1, 3).toLowerCase(),
          i = /td|th/.test(s) ? "tr" : "tr" == s ? "tbody" : "div",
          o = e.createElement(i);
        return o.stub = !0, "op" === s && x && 10 > x ? f(o, t) : o.innerHTML = t, o
      }

      function v(t, e) {
        if (t)
          if (e(t) === !1) v(t.nextSibling, e);
          else
            for (t = t.firstChild; t;) v(t, e), t = t.nextSibling
      }

      function b(t, e) {
        return t.replace(/<(yield)\/?>(<\/\1>)?/gim, e || "")
      }

      function y(t, s) {
        return s = s || e, s.querySelectorAll(t)
      }

      function O(t, e) {
        return t.filter(function (t) {
          return t === e
        })
      }

      function _(t) {
        function e() {}
        return e.prototype = t, new e
      }

      function U(t) {
        return M[t.getAttribute("riot-tag") || t.tagName.toLowerCase()]
      }

      function S(t) {
        var s = e.createElement("style");
        s.innerHTML = t, e.head.appendChild(s)
      }

      function k(t, e, s) {
        var i = M[e],
          o = t.innerHTML;
        return t.innerHTML = "", i && t && (i = new r(i, {
          root: t,
          opts: s
        }, o)), i && i.mount ? (i.mount(), T.push(i), i.on("unmount", function () {
          T.splice(T.indexOf(i), 1)
        })) : void 0
      }
      var w = {
          version: "v2.0.15",
          settings: {}
        },
        x = m();
      w.observable = function (t) {
          t = t || {};
          var e = {},
            s = 0;
          return t.on = function (i, o) {
            return "function" == typeof o && (o._id = "undefined" == typeof o._id ? s++ : o._id, i.replace(/\S+/g, function (t, s) {
              (e[t] = e[t] || []).push(o), o.typed = s > 0
            })), t
          }, t.off = function (s, i) {
            return "*" == s ? e = {} : s.replace(/\S+/g, function (t) {
              if (i)
                for (var s, o = e[t], n = 0; s = o && o[n]; ++n) s._id == i._id && (o.splice(n, 1), n--);
              else e[t] = []
            }), t
          }, t.one = function (e, s) {
            function i() {
              t.off(e, i), s.apply(t, arguments)
            }
            return t.on(e, i)
          }, t.trigger = function (s) {
            for (var i, o = [].slice.call(arguments, 1), n = e[s] || [], a = 0; i = n[a]; ++a) i.busy || (i.busy = 1, i.apply(t, i.typed ? [s].concat(o) : o), n[a] !== i && a--, i.busy = 0);
            return e.all && "all" != s && t.trigger.apply(t, ["all", s].concat(o)), t
          }, t
        },
        function (t, e, s) {
          function i() {
            return r.href.split("#")[1] || ""
          }

          function o(t) {
            return t.split("/")
          }

          function n(t) {
            t.type && (t = i()), t != a && (d.trigger.apply(null, ["H"].concat(o(t))), a = t)
          }
          if (s) {
            var a, r = s.location,
              d = t.observable(),
              c = s,
              l = !1,
              u = t.route = function (t) {
                t[0] ? (r.hash = t, n(t)) : d.on("H", t)
              };
            u.exec = function (t) {
              t.apply(null, o(i()))
            }, u.parser = function (t) {
              o = t
            }, u.stop = function () {
              l && (c.removeEventListener ? c.removeEventListener(e, n, !1) : c.detachEvent("on" + e, n), d.off("*"), l = !1)
            }, u.start = function () {
              l || (c.addEventListener ? c.addEventListener(e, n, !1) : c.attachEvent("on" + e, n), l = !0)
            }, u.start()
          }
        }(w, "hashchange", t);
      var D = function (t, e, s) {
          return function (i) {
            return e = w.settings.brackets || t, s != e && (s = e.split(" ")), i && i.test ? e == t ? i : RegExp(i.source.replace(/\{/g, s[0].replace(/(?=.)/g, "\\")).replace(/\}/g, s[1].replace(/(?=.)/g, "\\")), i.global ? "g" : "") : s[i]
          }
        }("{ }"),
        H = function () {
          function e(t, e) {
            return t = (t || D(0) + D(1)).replace(D(/\\{/g), "￰").replace(D(/\\}/g), "￱"), e = o(t, n(t, D(/{/), D(/}/))), new Function("d", "return " + (e[0] || e[2] || e[3] ? "[" + e.map(function (t, e) {
              return e % 2 ? s(t, !0) : '"' + t.replace(/\n/g, "\\n").replace(/"/g, '\\"') + '"'
            }).join(",") + '].join("")' : s(e[1])).replace(/\uFFF0/g, D(0)).replace(/\uFFF1/g, D(1)) + ";")
          }

          function s(t, e) {
            return t = t.replace(/\n/g, " ").replace(D(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), ""), /^\s*[\w- "']+ *:/.test(t) ? "[" + n(t, /["' ]*[\w- ]+["' ]*:/, /,(?=["' ]*[\w- ]+["' ]*:)|}|$/).map(function (t) {
              return t.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function (t, e, s) {
                return s.replace(/[^&|=!><]+/g, i) + '?"' + e + '":"",'
              })
            }).join("") + '].join(" ").trim()' : i(t, e)
          }

          function i(e, s) {
            return e = e.trim(), e ? "(function(v){try{v=" + (e.replace(r, function (e, s, i) {
              return i ? "(d." + i + "===undefined?" + ("undefined" == typeof t ? "global." : "window.") + i + ":d." + i + ")" : e
            }) || "x") + "}finally{return " + (s === !0 ? '!v&&v!==0?"":v' : "v") + "}}).call(d)" : ""
          }

          function o(t, e) {
            var s = [];
            return e.map(function (e, i) {
              i = t.indexOf(e), s.push(t.slice(0, i), e), t = t.slice(i + e.length)
            }), s.concat(t)
          }

          function n(t, e, s) {
            var i, o = 0,
              n = [],
              a = new RegExp("(" + e.source + ")|(" + s.source + ")", "g");
            return t.replace(a, function (e, s, a, r) {
              !o && s && (i = r), o += s ? 1 : -1, o || null == a || n.push(t.slice(i, r + a.length))
            }), n
          }
          var a = {},
            r = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi;
          return function (t, s) {
            return t && (a[t] = a[t] || e(t))(s)
          }
        }(),
        T = [],
        M = {};
      w.tag = function (t, e, s, i) {
        return "function" == typeof s ? i = s : s && S(s), M[t] = {
          name: t,
          tmpl: e,
          fn: i
        }, t
      }, w.mount = function (t, e, s) {
        function i(t) {
          var i = e || t.getAttribute("riot-tag") || t.tagName.toLowerCase(),
            o = k(t, i, s);
          o && a.push(o)
        }
        var o, n = function (t) {
            return t = Object.keys(M).join(", "), t.split(",").map(function (e) {
              t += ', *[riot-tag="' + e.trim() + '"]'
            }), t
          },
          a = [];
        if ("object" == typeof e && (s = e, e = 0), "string" == typeof t ? ("*" == t && (t = n(t)), o = y(t)) : o = t, "*" == e) {
          if (e = n(t), o.tagName) o = y(e, o);
          else {
            var r = [];
            u(o, function (t) {
              r = y(e, t)
            }), o = r
          }
          e = 0
        }
        return o.tagName ? i(t) : u(o, i), a
      }, w.update = function () {
        return u(T, function (t) {
          t.update()
        })
      }, w.mountTo = w.mount, w.util = {
        brackets: D,
        tmpl: H
      }, "object" == typeof exports ? module.exports = w : /*"function" == typeof define && define.amd ? define(function () {
        return w   过时的define写法？
      }) :*/ t.riot = w
    }("undefined" != typeof t ? t : s),
    function (t, e) {
      "use strict";

      function s(t) {
        t && (this.el = t.length ? t[0] : t, t.length > 1 && (this.els = t))
      }

      function i(t) {
        if ("object" == typeof t) return new s(t);
        var i = "querySelectorAll";
        return 0 === t.indexOf("#") && (i = "getElementById", t = t.substr(1, t.length)), new s(e[i](t))
      }

      function o(t) {
        var e = this.el;
        if (e) return e.classList ? e.classList.add(t) : void(e.className += " " + t)
      }

      function n(t) {
        var e = this.el;
        if (e) return e.classList ? e.classList.remove(t) : void(e.className = e.className.replace(new RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " "))
      }

      function a(t) {
        var e = this.el;
        if (e) return e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className)
      }

      function r(t) {
        (this.el || this.els.length) && Array.prototype.forEach.call(this.els || [this.el], t, this)
      }

      function d(t) {
        return this.el ? "undefined" == typeof t ? this.el.innerHTML : void(this.el.innerHTML = t) : void 0
      }

      function c(t) {
        this.el && (this.el.outerHTML = t)
      }

      function l() {
        this.el && (this.el.innerHTML = "")
      }

      function u(t, e) {
        var s = this.el;
        if (s && s.getAttribute && s.setAttribute) return "undefined" == typeof e ? s.getAttribute(t) : s.setAttribute(t, e)
      }

      function h() {
        return this.el ? this.el.parentNode : void 0
      }

      function p() {
        return this.el ? this.el.textContent : void 0
      }

      function m() {
        if (this.el && this.el.getBoundingClientRect) {
          var t = this.el.getBoundingClientRect();
          return {
            top: t.top + e.body.scrollTop,
            left: t.left + e.body.scrollLeft,
            height: t.height
          }
        }
      }

      function f() {
        return this.el ? {
          left: this.el.offsetLeft,
          top: this.el.offsetTop
        } : void 0
      }

      function g(t, e) {
        this.el && this.el.addEventListener && this.el.addEventListener(t, e)
      }

      function v(t, e) {
        this.el && this.el.removeEventListener && this.el.removeEventListener(t, e)
      }

      function b() {
        this.el && this.el.parentNode.removeChild(this.el)
      }

      function y(t) {
        return "loading" != e.readyState ? t() : void e.addEventListener("DOMContentLoaded", t)
      }

      function O(t, s) {
        var i = s || e.body;
        i.appendChild(e.createElement(t))
      }
      t.$ds = i;
      var _ = t._dom = {};
      _.ready = y, _.appendTag = O, s.prototype.addClass = o, s.prototype.removeClass = n, s.prototype.hasClass = a, s.prototype.each = r, s.prototype.html = d, s.prototype.replaceWith = c, s.prototype.empty = l, s.prototype.attr = u, s.prototype.parent = h, s.prototype.text = p, s.prototype.offset = m, s.prototype.position = f, s.prototype.remove = b, s.prototype.on = g, s.prototype.off = v
    }(t, e),
    function (t, e) {
      "use strict";

      function s() {
        var e = t.console;
        return e && e.error && e.warn ? e : {
          error: function () {},
          log: function () {},
          warn: function () {}
        }
      }

      function i(t, e) {
        l.on("ready", function (s) {
          t.update(), e && e(s)
        })
      }

      function o() {
        var s = t.navigator.userAgent,
          i = e.createElement("div");
        i.innerHTML = '<a href="/a" style="opacity:.55;">a</a><input type="checkbox"/>';
        var o = i.getElementsByTagName("a")[0],
          n = i.getElementsByTagName("input")[0],
          a = {
            placeholder: "placeholder" in n,
            touch: "ontouchstart" in t || "onmsgesturechange" in t,
            opacity: /^0.55$/.test(o.style.opacity),
            hrefNormalized: "/a" === o.getAttribute("href"),
            iOS: s.match(/ \((iPad|iPhone|iPod);( U;)? CPU( iPhone)? OS /),
            android: s.match(/ \(Linux; U; Android /),
            ie6: !t.XMLHttpRequest && "undefined" == typeof i.style.maxHeight
          };
        return a.authInWin = t.postMessage && t.screen.width > 800 && !a.iOS && !a.android && t.location.origin, a
      }

      function n() {
        var t = duoshuoQuery.short_name;
        duoshuoQuery.theme && DUOSHUO.utils.loadTheme(duoshuoQuery.theme), localStorage && _.each(["site", "lang"], function (e) {
          var s = localStorage["ds_" + e + "_" + t];
          if (s) {
            var i = JSON.parse(s);
            "site" === e && (l.site = i), "lang" === e && _.extend(l._lang, i)
          }
        })
      }

      function a() {
        function t(t) {
          var e = l._libsMd5[t] ? "?" + l._libsMd5[t] + ".js" : "";
          return l.STATIC_URL + "/libs/" + t + ".js" + e
        }
        var e = {};
        return function (s, i) {
          if ("string" == typeof s) return e[s] ? i() : _.injectScript(t(s), function () {
            e[s] = !0, i()
          });
          if ("object" == typeof s) {
            var o = !0;
            _.each(s, function (n) {
              e[n] || (o = !1, _.injectScript(t(n), function () {
                e[n] = !0;
                for (var t = 0; t < s.length; t++)
                  if (!e[s[t]]) return;
                i()
              }))
            }), o && i()
          }
        }
      }

      function r(t) {
        function e() {
          function t(t) {
            i.loadRequire(t), l.trigger("ready", t)
          }
          duoshuoQuery && duoshuoQuery.short_name && (l.trigger("queryDefined"), s.get("base/site", i.backgroundParams({}), t), s.get("base/visitor", i.backgroundParams({}), t))
        }
        var s = l.API,
          i = l.utils;
        d(("string" == typeof t ? [t] : t) || null), e()
      }

      function d(t) {
        var e = l.components,
          s = ["thread", "recent-comments", "recent-visitors", "top-users", "top-threads", "login", "thread-count", "share", "share-aside"];
        _.each(t || s, function (t) {
          if (!e[t]) {
            var s = 0 === t.indexOf("ds-") ? t : "ds-" + t,
              i = riot.mount("." + s, s);
            i && i.length && (e[t] = "thread-count" === t ? i : i[0])
          }
        })
      }

      function c(t, e) {
        l.smilies[t] = e
      }
      t.console = s(), String.prototype.trim || ! function () {
        var t = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
          return this.replace(t, "")
        }
      }();
      var l = t.DUOSHUO = riot.observable(),
        u = ["status", "smilies", "visitor", "site", "unread", "utils", "components", "notifications", "constents"];
      l.updateWhenReady = i, l.on("queryDefined", n), l.mount = r, l.mountClasses = d, l.addSmilies = c, l.require = a(), l.environment = {
        ie: e.all,
        protocol: "https:" == e.location.protocol ? "https:" : "http:",
        supports: o()
      };
      for (var h = 0; h < u.length; h++) ! function (t) {
        l[t] = "notifications" !== t ? {} : []
      }(u[h])
    }(t, e),
    function (t) {
      "use strict";
      var e = t.constents;
      e.timeOffset = 0, e.sourceName = {
        weibo: "新浪微博",
        qq: "QQ",
        qzone: "QQ空间",
        qqt: "腾讯微博",
        renren: "人人网",
        douban: "豆瓣网",
        netease: "网易微博",
        kaixin: "开心网",
        sohu: "搜狐微博",
        baidu: "百度",
        taobao: "淘宝",
        msn: "MSN",
        google: "谷歌",
        wechat: "微信",
        diandian: "点点网",
        duitang: "堆糖",
        youdao: "有道云笔记",
        pengyou: "朋友网",
        facebook: "Facebook",
        twitter: "Twitter",
        linkedin: "Linkedin",
        huaban: "花瓣网",
        mogujie: "蘑菇街",
        meilishuo: "美丽说"
      }, e.serviceNames = {
        weibo: "微博",
        qq: "QQ",
        douban: "豆瓣",
        renren: "人人",
        netease: "网易",
        kaixin: "开心",
        sohu: "搜狐",
        baidu: "百度",
        taobao: "淘宝",
        msn: "MSN",
        google: "谷歌",
        wechat: "微信",
        diandian: "点点",
        duitang: "堆糖",
        youdao: "有道云笔记",
        pengyou: "朋友网",
        facebook: "Facebook",
        twitter: "Twitter",
        linkedin: "Linkedin",
        huaban: "花瓣网",
        mogujie: "蘑菇街",
        meilishuo: "美丽说"
      }
    }(t.DUOSHUO),
    function () {
      "use strict";

      function s(t, e, s) {
        return -1 === t.indexOf("ds-") && (t = "ds-" + t), h.appendTag(t, s), riot.mount(t, e || {})[0]
      }

      function i(t, e, s) {
        return l("#dsDialogContent").empty(), p.tag && p.tag.unmount(!0), p.tag = riot.mount("#dsDialogContent", t, e || {})[0], DUOSHUO.trigger("dialogOpen", e), s && "function" == typeof s && s(), p.tag
      }

      function o() {
        p.tag && (p.tag.unmount(!0), DUOSHUO.trigger("dialogClose"))
      }

      function n() {
        m.tag = s("indicator")
      }

      function a() {
        m.tag && m.tag.unmount()
      }

      function r(t, s) {
        var i = e.body;
        if (!(0 > s)) {
          var o = t - i.scrollTop,
            n = o / s * 10;
          setTimeout(function () {
            i.scrollTop = i.scrollTop + n, i.scrollTop !== t && r(t, s - 10)
          }, 10)
        }
      }

      function d(e) {
        function s(e, s) {
          var i = t.location,
            o = {
              weibo: [760, 600],
              renren: [420, 322],
              qq: [504, 445],
              netease: [810, 645],
              sohu: [972, 600],
              google: [600, 440],
              taobao: [480, 585]
            }[e] || [550, 400];
          return t.open(s + (-1 == s.indexOf("?") ? "?" : "&") + _.param({
            origin: i.origin || "http://" + i.host
          }), "_blank", "width=" + o[0] + ",height=" + o[1] + ",toolbar=no,menubar=no,location=yes")
        }
        if (!DUOSHUO.environment.supports.authInWin) return void(t.location.href = e);
        var i = e.match(/\/(login|bind)\/(\w+)\//i);
        if (i && DUOSHUO.constents.serviceNames[i[2]]) return !s(i[2], e)
      }

      function c(t) {
        return d(t.target.getAttribute("href"))
      }
      var l = $ds,
        u = DUOSHUO.utils,
        h = t._dom;
      u.mountTag = s;
      var p = u.dialog = {};
      p.open = i, p.close = o;
      var m = u.indicator = {};
      m.show = n, m.hide = a, u.authInWinHandler = d, u.authClick = c, u.scrollTo = r
    }(),
    function () {
      "use strict";

      function e(t) {
        return o ? o[t] : void 0
      }

      function s(t, e) {
        if (o) try {
          var s = DUOSHUO.constents.timeOffset;
          o.removeItem(t), o[t] = JSON.stringify(e), o.removeItem(t + ":timestamp"), o[t + ":timestamp"] = Math.floor((new Date - s) / 1e3)
        } catch (i) {}
      } {
        var i = DUOSHUO.utils,
          o = t.localStorage;
        i.cache = {}
      }
      i.cache.get = e, i.cache.save = s
    }(),
    function () {
      "use strict";

      function t(t) {
        return t.parse("2011-10-28T00:00:00+08:00") && function (e) {
          return new t(e)
        } || t.parse("2011/10/28T00:00:00+0800") && function (e) {
          return new t(e.replace(/-/g, "/").replace(/:(\d\d)$/, "$1"))
        } || t.parse("2011/10/28 00:00:00+0800") && function (e) {
          return new t(e.replace(/-/g, "/").replace(/:(\d\d)$/, "$1").replace("T", " "))
        } || function (e) {
          return new t(e)
        }
      }

      function e(t) {
        var e = i.parseDate(t);
        return e.getFullYear() + "年" + (e.getMonth() + 1) + "月" + e.getDate() + "日 " + e.toLocaleTimeString()
      }

      function s(t) {
        var e = i.parseDate(t),
          s = new Date,
          o = (s - DUOSHUO.constents.timeOffset - e) / 1e3;
        return 10 > o ? "刚刚" : 60 > o ? Math.round(o) + "秒前" : 3600 > o ? Math.round(o / 60) + "分钟前" : 86400 > o ? Math.round(o / 3600) + "小时前" : (s.getFullYear() == e.getFullYear() ? "" : e.getFullYear() + "年") + (e.getMonth() + 1) + "月" + e.getDate() + "日"
      }
      var i = DUOSHUO.utils;
      i.parseDate = t(Date), i.fullTime = e, i.elapsedTime = s
    }(),
    function (t, e, s) {
      "use strict";

      function i() {
        for (var t = {}, e = 0; e < arguments.length; e++) arguments[e] && _.extend(t, arguments[e]);
        var s = _.param(t);
        return s ? "?" + s : ""
      }

      function o() {
        var t = _.getCookie("duoshuo_token");
        return t ? {
          jwt: t
        } : duoshuoQuery.remote_auth ? {
          short_name: duoshuoQuery.short_name,
          remote_auth: duoshuoQuery.remote_auth
        } : s
      }

      function n() {
        if (!duoshuoQuery && (duoshuoQuery = t.duoshuoQuery)) {
          if (!duoshuoQuery.short_name || "your_duoshuo_short_name" === duoshuoQuery.short_name) return duoshuoQuery = s, c.errors.handle("missing_dsq_shortname", {
            showAlert: !0
          });
          DUOSHUO.trigger("queryDefined")
        }
        return duoshuoQuery
      }

      function a(t, s) {
        t = d(t);
        var i = {
          require: s && s.initRequest ? "site,visitor,nonce,lang,unread,log,extraCss" : "",
          site_ims: l.get("ds_site_" + duoshuoQuery.short_name + ":timestamp"),
          lang_ims: l.get("ds_lang_" + duoshuoQuery.short_name + ":timestamp"),
          referer: e.referrer
        };
        duoshuoQuery.stylePatch && (i.style_patch = duoshuoQuery.stylePatch);
        for (var o in i) i[o] && (!DUOSHUO.environment.supports.ie6 || encodeURIComponent(i[o]).length < 200) && (t[o] = i[o]);
        return t
      }

      function r(t, e) {
        for (var s = {}, i = t.split(" "), o = 0; o < i.length; o++) ! function (t) {
          (e[t] || e["data-" + t]) && (s[d(t)] = e[t] || e["data-" + t])
        }(i[o]);
        return s
      }

      function d(t) {
        if ("string" == typeof t) return t.replace(/-/g, "_");
        var e = ["class"],
          s = ["data-", "-"];
        for (var i in t) ! function (i) {
          if (e.indexOf(i) > -1) return void delete t[i];
          for (var o = 0, n = 0; n < s.length; n++) - 1 === i.indexOf(s[n]) && o++;
          if (o !== s.length) {
            var a = i;
            a.indexOf("data-") > -1 && (a = a.replace("data-", "")), a.indexOf("-") > -1 && (a = a.replace(/-/g, "_")), t[a] = t[i], delete t[i]
          }
        }(i);
        return t
      }
      var c = DUOSHUO.utils,
        l = c.cache;
      c.jwtParam = o, c.formatQuery = r, c.backgroundParams = a, c.queryIfNecessary = i, c.checkDuoshuoQuery = n
    }(t, e),
    function () {
      "use strict";

      function t() {
        return duoshuoQuery.short_name ? DUOSHUO.environment.protocol + "//" + duoshuoQuery.short_name + "." + DUOSHUO.DOMAIN : DUOSHUO.REMOTE
      }

      function s(e) {
        var s = duoshuoQuery.sso && duoshuoQuery.sso.login ? {
          sso: 1,
          redirect_uri: duoshuoQuery.sso.login
        } : null;
        return t() + "/bind/" + e + "/" + c(s, d.jwtParam())
      }

      function i(e, s) {
        return s || (s = {}), duoshuoQuery.sso && duoshuoQuery.sso.login && (s.sso = 1, s.redirect_uri = duoshuoQuery.sso.login), t() + "/login/" + e + "/" + c(s)
      }

      function o() {
        var e = duoshuoQuery.sso && duoshuoQuery.sso.logout ? {
          sso: 1,
          redirect_uri: duoshuoQuery.sso.logout
        } : null;
        return t() + "/logout/" + c(e)
      }

      function n() {
        return 0 == DUOSHUO.visitor.user_id
      }

      function a(t) {
        if (t.match(/^(http|https):/)) return t;
        var s = e.createElement("a");
        return s.href = t, DUOSHUO.environment.supports.hrefNormalized ? s.href : s.getAttribute("href", 4)
      }

      function r() {
        function t(t) {
          return e[t] || "&amp;"
        }
        var e = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
          },
          s = /&(?!\w+;)|[<>"'`]/g,
          i = /[&<>"'`]/;
        return function (e) {
          return null == e || e === !1 ? "" : i.test(e) ? e.replace(s, t) : e
        }
      }
      var d = DUOSHUO.utils,
        c = d.queryIfNecessary;
      d.hostUrl = t, d.isGuest = n, d.bindUrl = s, d.loginUrl = i, d.logoutUrl = o, d.resolveUrl = a, d.encodeHTML = r()
    }(),
    function () {
      "use strict";

      function e(t, e) {
        DUOSHUO.theme = t, "none" !== t && _.injectStylesheet(DUOSHUO.STATIC_URL + "/styles/embed" + (t ? "." + t + ".css?" + DUOSHUO._styleMd5[t] : "." + short_name) + ".css", e)
      }

      function s(t, s) {
        if (t.visitor) {
          var o = !DUOSHUO.visitor && t.visitor.user_id && a && !a.requestPermission();
          o && DUOSHUO.ws.send({
            logged_user_id: t.visitor.user_id
          }), DUOSHUO.visitor = t.visitor
        }
        if (t.site && (DUOSHUO.site = t.site, n.save("ds_site_" + duoshuoQuery.short_name, t.site)), !DUOSHUO.theme && DUOSHUO.site.theme && e(DUOSHUO.site.theme, s), t.lang && (_.extend(DUOSHUO._lang, t.lang), n.save("ds_lang_" + duoshuoQuery.short_name, t.lang)), t.stylesheets)
          for (var r = 0; r < t.stylesheets.length; r++) _.injectStylesheet(t.stylesheets[r]);
        if (t.nonce && (DUOSHUO.nonce = t.nonce), t.style && _.injectStyle((t.style || "") + i(duoshuoQuery.component_style)), t.unread && (DUOSHUO.unread = t.unread), t.warnings)
          for (var r = 0; r < t.warnings.length; r++) console.warn(t.warnings[r])
      }

      function i(t) {
        var e = "",
          s = {};
        if (s.textbox = "#ds-thread #ds-reset .ds-replybox .ds-textarea-wrapper", !t) return e;
        for (var i in t) e += s[i] + "{" + t[i] + "}\n";
        return e
      }
      var o = DUOSHUO.utils,
        n = o.cache,
        a = t.Notification;
      o.loadTheme = e, o.loadRequire = s, o.compileStyle = i
    }(),
    function (t) {
      "use strict";

      function e() {
        function e() {
          for (var e; e = o.shift();) {
            var s = e.url,
              n = new i(e.title, {
                dir: "auto",
                icon: e.iconUrl,
                body: e.body
              });
            try {
              n.onclick = function () {
                t.focus(), location.href = s, n.close()
              }
            } catch (a) {}
            setTimeout(function () {
              n.close && n.close()
            }, 8e3)
          }
        }
        "Notification" in t && "denied" !== i.permission && ("granted" === i.permission && e(), i.requestPermission(function (t) {
          "granted" === t && e()
        }))
      }
      var s = DUOSHUO.utils,
        i = t.Notification,
        o = DUOSHUO.notifications;
      s.desktopNotification = e
    }(t),
    function (t) {
      "use strict";

      function e(t, e) {
        var s = t.code.toString();
        if (0 === s.indexOf("99")) return console.info(t.errorMessage);
        var i = o[parseInt(s[0]) - 1],
          a = (n[parseInt(s[1]) - 1], {
            E: "error",
            W: "warn",
            N: "info"
          });
        a[i] && (console[a[i]](t.errorMessage), e && e.showAlert && alert(t.errorMessage))
      }

      function s(t, s) {
        return "string" == typeof t ? e(a[t] || a.default, s) : void e(t, s)
      }
      var i = t.utils,
        o = ["E", "W", "N"],
        n = ["V", "S", "B"],
        a = {
          missing_dsq: {
            code: "12",
            errorMessage: "缺少 duoshuoQuery 的定义"
          },
          missing_dsq_shortname: {
            code: "12",
            errorMessage: "你还没有设置多说域名(duoshuoQuery.short_name)，填入已有域名或创建新站点：http://duoshuo.com/create-site/"
          },
          missing_message: {
            code: "11",
            errorMessage: "您还没写内容呢"
          },
          missing_email: {
            code: "11",
            errorMessage: "请输入一个有效的 Email 地址"
          },
          missing_data_url: {
            code: "12",
            errorMessage: "请设置 data-url"
          },
          missing_thread_key: {
            code: "12",
            errorMessage: "请设置正确的 data-thread-key 属性"
          },
          missing_share_type: {
            code: "11",
            errorMessage: "还没有选发布到哪儿呢"
          },
          define_dsq: {
            code: "22",
            errorMessage: "请在加载多说 embed.js 之前定义 duoshuoQuery"
          },
          "default": {
            code: "12",
            errorMessage: "啊喔，出错了"
          }
        };
      i.errors = {}, i.errors.handle = s
    }(t.DUOSHUO),
    function (t, e, s, i) {
      "use strict";

      function o(e, o, n, a, r) {
        function h(t) {
          var e = t.getResponseHeader("Date");
          e && (s.constents.timeOffset = new Date - new Date(e))
        }

        function p(t, e, s) {
          var i, o, n, d = e;
          if (t >= 200 && 300 > t || 304 === t)
            if (304 === t) d = "notmodified", n = !0;
            else try {
              i = JSON.parse(s), d = "success", n = !0
            } catch (c) {
              d = "parsererror", o = c
            } else {
              o = d, (!d || t) && (d = "error", 0 > t && (t = 0));
              try {
                i = JSON.parse(s)
              } catch (c) {
                d = "parsererror", o = c
              }
            }
            n ? a && a(i): "parseerror" === d ? u({
            code: "13",
            errorMessage: "解析错误: " + s
          }) : (u(i), r && r(i), i.errorTrace && console.error(i.errorTrace)), h(g)
        }
        var m = _.getCookie("duoshuo_token");
        n = n || {}, n.v = s.version, m ? n.jwt = m : duoshuoQuery.remote_auth && (n.remote_auth = duoshuoQuery.remote_auth);
        var f = XMLHttpRequest && JSON && JSON.parse;
        if (f) {
          var g = new XMLHttpRequest,
            v = !!g && "withCredentials" in g;
          if (v) {
            var b;
            g.open(e, c.hostUrl() + "/api/" + o + ".json" + ("GET" == e ? "?" + _.param(n) : ""), !0), g.withCredentials = !0, g.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            var y = l.get("ds_lastmods");
            if (y && t.JSON) try {
              var O = JSON.parse(y)[duoshuoQuery.short_name];
              O && g.setRequestHeader("Accept-Language", O)
            } catch (U) {}
            return g.send("GET" == e ? null : _.param(n)), b = function (t, e) {
              var s, o, n, a;
              try {
                if (b && (e || 4 === g.readyState))
                  if (b = i, e) 4 !== g.readyState && g.abort();
                  else {
                    s = g.status, n = g.getAllResponseHeaders();
                    var r = g.getResponseHeader("Last-Modified");
                    if (r) {
                      var d = {};
                      d[duoshuoQuery.short_name] = r, l.save("ds_lastmods", d)
                    }
                    try {
                      a = g.responseText
                    } catch (t) {}
                    try {
                      o = g.statusText
                    } catch (c) {
                      o = ""
                    }
                  }
              } catch (u) {
                e || p(-1, u)
              }
              a && p(s, o, a, n)
            }, void(4 === g.readyState ? b() : g.onreadystatechange = b)
          }
        }
        "GET" != e && (n._method = "POST");
        var S = "cb_" + Math.round(1e6 * Math.random());
        d[S] = function (t) {
          return 0 === t.code ? void(a && a(t)) : (r && r(t), u(t), void(t.errorTrace && console.error(t.errorTrace)))
        }, n.callback = "DUOSHUO.API['" + S + "']", _.injectScript(c.hostUrl() + "/api/" + o + ".jsonp?" + _.param(n))
      }

      function n(t, e, s, i) {
        return e.__comboMode ? r("GET", t, e, s, i) : this.ajax("GET", t, e, s, i)
      }

      function a(t, e, s, i) {
        return e.__comboMode ? r("POST", t, e, s, i) : this.ajax("POST", t, e, s, i)
      }

      function r(t, e, i, n, a) {
        function r() {
          function s(t) {
            return function (e) {
              for (var s = 0; s < d.cb[t].length; s++) ! function (t) {
                t(e)
              }(d.cb[t][s])
            }
          }
          var n = {};
          n[i.queryKey] = d.query.join(","), o(t, e, n, s("success"), s("error"))
        }
        h[e] || (h[e] = {});
        var d = h[e];
        d.query || (d.query = []), d.cb || (d.cb = {}), d.cb.success || (d.cb.success = []), d.cb.error || (d.cb.error = []), d._count || (d._count = 0), delete i.__comboMode, d.query.push(i[i.queryKey]), d.cb.success.push(n), d.cb.error.push(a), d._count++, s.on("ready", function () {
          var t = s.components["thread-count"] && s.components["thread-count"].length === d._count;
          t && (r(), delete d._count)
        })
      }
      var d = s.API = {},
        c = s.utils,
        l = c.cache,
        u = c.errors.handle,
        h = {};
      d.ajax = o, d.get = n, d.post = a
    }(t, e, t.DUOSHUO),
    function (t, e, s) {
      "use strict";

      function i(i) {
        function a() {
          function i() {
            var t, e = 1 === c.readyState;
            if (e)
              for (; t = r.messages.shift();) c.send(t)
          }

          function a(t) {
            try {
              var e = JSON.parse(t.data)
            } catch (i) {
              return
            }
            switch (e.type) {
              case "post":
                var a = s.components.thread;
                if (!a) return;
                a.tags["ds-comments"].addOne(e);
                break;
              case "notification":
                n.push(e), o.desktopNotification()
            }
          }
          var d = "https:" === e.location.protocol ? "wss://ws.duoshuo.com:8202/" : "ws://ws.duoshuo.com:8201/",
            c = r.webSocket = new WebSocket(d);
          c.onopen = i, c.onmessage = a, t.addEventListener("beforeunload", function () {
            c.close()
          })
        }
        if ("WebSocket" in t && t.JSON) {
          var r = this;
          r.messages.push(t.JSON.stringify(i)), r.webSocket || a(), r.webSocket.onopen()
        }
      }
      var o = s.utils,
        n = s.notifications,
        a = s.ws = {};
      a.messages = [], a.send = i
    }(t, e, t.DUOSHUO);
    var n = "https:" == e.location.protocol ? "https:" : "http:";
    DUOSHUO.DOMAIN = "duoshuo.com", DUOSHUO.STATIC_URL = n + "//static.duoshuo.com", DUOSHUO.REMOTE = n + "//duoshuo.com", DUOSHUO.version = "15.5.20", DUOSHUO._styleMd5 = {
        "default": "080f31b2",
        dark: "ddc346d8",
        bluebox: "0f0f035c",
        newhua: "dc453ca2"
      }, DUOSHUO._libsMd5 = {
        "embed.compat": "24f8ca3f",
        smilies: "921e8eda"
      }, DUOSHUO._lang = {
        post: "发布",
        posting: "正在发布",
        settings: "设置",
        reply: "回复",
        like: "顶",
        repost: "转发",
        report: "举报",
        "delete": "删除",
        reply_to: "回复 ",
        reposts: "转发",
        comments: "评论",
        floor: "楼",
        latest: "最新",
        earliest: "最早",
        hottest: "最热",
        share_to: "分享到:",
        leave_a_message: "说点什么吧…",
        no_comments_yet: "还没有评论，沙发等你来抢",
        repost_reason: "请输入转发理由",
        hot_posts_title: "被顶起来的评论",
        comments_zero: "暂无评论",
        comments_one: "1条评论",
        comments_multiple: "{num}条评论",
        reposts_zero: "暂无转发",
        reposts_one: "1条转发",
        reposts_multiple: "{num}条转发",
        weibo_reposts_zero: "暂无新浪微博",
        weibo_reposts_one: "1条新浪微博",
        weibo_reposts_multiple: "{num}条新浪微博",
        qqt_reposts_zero: "暂无腾讯微博",
        qqt_reposts_one: "1条腾讯微博",
        qqt_reposts_multiple: "{num}条腾讯微博"
      }, riot.tag("ds-avatar", '<div class="ds-avatar"><a rel="nofollow author" target="_blank" if="{ hasLink }" href="{ utils.encodeHTML(user.url) }" onmouseenter="{ bubbleEnter }" onmouseleave="{ bubbleLeave }" onclick="{ user.user_id ? this.href = utils.hostUrl() + \'/user-url/?user_id=\' + user.user_id : \'javascript:void(0);\'}" ><ds-avatar-image user="{ user }" size="{ opts.size }" ></ds-avatar-image></a>  <ds-avatar-image if="{ !hasLink }" user="{ user }" size="{ opts.size }" ></ds-avatar-image><ds-service-icon if="{ opts.icon }" service="{ opts.icon }"></ds-service-icon></div>', function (t) {
        function e() {
          return !!s.user.user_id
        }
        var s = this,
          i = this.bubble = DUOSHUO.components.bubble;
        this.utils = DUOSHUO.utils, this.user = t.user, this.on("update", function () {
          this.hasLink = t.user && !!t.user.url
        }), this.bubbleEnter = function (t) {
          if (e()) {
            var s = {};
            s.type = "user", s.data = this.user, i.enter(s, t)
          }
        }.bind(this), this.bubbleLeave = function () {
          e() && i.leave()
        }.bind(this)
      }), riot.tag("ds-avatar-visitor", "<a class=\"ds-avatar\" onclick=\"{ g ? 'return false' : ''}\" target=\"{ g ? '_self' : '_blank'}\" title=\"{ g ? '' : '设置头像'}\" href=\"{ g ? 'javascript:void(0);' : author() }\"><ds-avatar-image user=\"{ opts.user }\" size=\"{ opts.size }\" ></ds-avatar-image></a>", function () {
        var t = DUOSHUO.utils;
        DUOSHUO.updateWhenReady(this), this.on("update", function () {
          this.g = t.isGuest()
        }), this.author = function () {
          return DUOSHUO.REMOTE + "/settings/avatar/" + t.queryIfNecessary(t.jwtParam())
        }.bind(this)
      }), riot.tag("ds-avatar-image", '<img riot-src="{ utils.encodeHTML(makeSrc(opts.user)) }" riot-style="{ opts.size ? makeSize(opts.size) : \'\'}" alt="{ utils.encodeHTML(opts.user.name) }">', function () {
        this.utils = DUOSHUO.utils, DUOSHUO.updateWhenReady(this), this.makeSrc = function (t) {
          if ("undefined" != typeof t) {
            if (t.avatar_url) return t.avatar_url;
            if (DUOSHUO.site.default_avatar_url) return DUOSHUO.site.default_avatar_url
          }
        }.bind(this), this.makeSize = function (t) {
          return "width: " + t + "px; height: " + t + "px;"
        }.bind(this)
      }), riot.tag("ds-bubble", '<div id="ds-bubble" riot-style="{ style }" onmouseenter="{ bubbleIn }" onmouseleave="{ bubbleOut }"><div class="ds-bubble-content" id="dsBubbleContent"></div><div class="ds-arrow ds-arrow-down ds-arrow-border"></div><div class="ds-arrow ds-arrow-down"></div></div>', function () {
        var t = $ds,
          e = this,
          s = {},
          i = bubbleOutTimer = 0;
        this.style = "display: none", this.hide = function () {
          this.style = "display: none", this.update()
        }.bind(this), this.show = function (t) {
          this.style = "display: block;" + t, this.update()
        }.bind(this), this.bubbleIn = function () {
          bubbleOutTimer && (clearTimeout(bubbleOutTimer), bubbleOutTimer = 0)
        }.bind(this), this.bubbleOut = function () {
          bubbleOutTimer = setTimeout(function () {
            bubbleOutTimer = 0, s.tag.unmount(!0), e.hide()
          }, 400)
        }.bind(this), this.enter = function (o, n) {
          function a() {
            i = 0, s.owner = r, e.bubbleIn();
            var n = c.offset(),
              a = t(d).offset(),
              l = (c.el.offsetWidth + 40) / 2,
              u = d.offsetHeight - (n.top - a.top) + 6,
              h = n.left - a.left - 35 + (l > 35 ? 35 : l);
            e.show("bottom:" + u + "px; left:" + h + "px;"), s.tag && s.tag.unmount(!0);
            var p = {};
            "ctx" === o.type ? (p.comment = o.comment, p.parentComment = o.data) : p = o.data, s.tag = riot.mount("#dsBubbleContent", "ds-bubble-" + o.type, p)[0]
          }
          var r = n.target,
            d = e.root.parentElement;
          if (bubbleOutTimer && s.owner == r) return clearTimeout(bubbleOutTimer), void(bubbleOutTimer = 0);
          var c = t(r);
          i = setTimeout(a, 200)
        }.bind(this), this.leave = function () {
          i ? (clearTimeout(i), i = 0) : bubbleOutTimer || this.bubbleOut()
        }.bind(this)
      }), riot.tag("ds-bubble-user", '<div id="ds-user-card"><a href="{ opts.url }" class="ds-avatar" target="_blank"><ds-avatar-image user="{ opts }"></ds-avatar-image></a><a href="{ opts.url }" class="ds-user-name ds-highlight" target="_blank">{ opts.name }</a><span><a each="{ service in opts.social_uid }" target="_blank" class="ds-service-icon ds-{ service }" title="{ sourceName[service] }" href="{ REMOTE }/user-proxy/{ service }/{ parent.opts.social_uid[service] }/"></a></span><p class="ds-user-card-meta"><a href="{ REMOTE }/profile/{ opts.user_id }/" target="_blank"><span class="ds-highlight">{ opts.comments || 0 }</span>条评论</a></p><p class="ds-user-description" if="{ opts.description }"> { opts.description } </p></div>', function () {
        this.REMOTE = DUOSHUO.REMOTE, this.sourceName = DUOSHUO.constents.sourceName
      }), riot.tag("ds-bubble-ctx", '<div id="ds-ctx-bubble"><ul id="ds-ctx"><ds-context-comment comment="{ opts.parentComment }"></ds-context-comment></ul><div class="ds-bubble-footer"><a class="ds-ctx-open" onclick="{ openDialog }" href="javascript:void(0);">查看对话</a></div></div>', function (t) {
        var e = DUOSHUO.API,
          s = DUOSHUO.utils.dialog;
        this.openDialog = function () {
          function i(t) {
            s.open("ds-dialog-ctx-comments", {
              style: "width: 600px;",
              bodyStyle: "max-height: 350px; _height: 350px; overflow-y: auto;",
              comments: t.response
            })
          }
          var o = {};
          o.post_id = t.comment.post_id, e.get("posts/conversation", o, i)
        }.bind(this)
      }), riot.tag("ds-comment", '<li class="ds-post" id="{ \'ds-post-\' + comment.post_id }"><div class="ds-post-self">  <ds-avatar user="{ author }" icon="{ comment.source }"></ds-avatar> \
        <div class="ds-comment-body"><div class="ds-comment-header"> \
          <a class="ds-user-name ds-highlight" if="{ author.url }" href="{ author.url }" onmouseenter="{ !isSocial ? bubbleEnter : \'\' }" onmouseleave="{ !isSocial ? bubble.leave : \'\' }" rel="nofollow" target="_blank">{ author.name }</a> \
          <span class="ds-user-name" if="{ !!!author.url }">{ author.name }</span> \
          <span class="ua" if="{ userTail.isAdmin(author) }"> \
            <span class="this_ua ua_admin"><i class="fa fa-user"></i> admin</span> \
            <br if="{ userTail.isMobile }"><br if="{ userTail.isMobile }"> \
          </span> \
          <span class="ua" if="{ comment.OSResult = userTail.hasOSSpan(comment.agent) }"> \
            <span class="{ \'os_\' + userTail.getOSText(comment.OSResult).os }"> \
              <i class="{ \'fa fa-\' + userTail.getOSText(comment.OSResult).icon }"></i>{ comment.OSResult }</span> \
            <br if="{ userTail.isMobile }"><br if="{ userTail.isMobile }"> \
          </span> \
          <span class="ua" if="{ comment.deviceResult = userTail.hasDeviceSpan(comment.agent) }"> \
            <span class="device"><i class="fa fa-mobile"></i>{ comment.deviceResult }</span>\
            <br if="{ userTail.isMobile }"><br if="{ userTail.isMobile }"> \
          </span> \
          <span class="ua" if="{ comment.browserResult = userTail.BrowserDetect(comment.agent) }"> \
            <span class="ua_{ userTail.getBrowserText(comment.browserResult).browser }"><i class="fa fa-{ userTail.getBrowserText(comment.browserResult).icon }"></i>{ comment.browserResult }</span>\
            <br if="{ userTail.isMobile }"><br if="{ userTail.isMobile }"> \
          </span> \
          <span class="ua" if="{ !comment.browserResult }"> \
            <span class="ua_other"><i class="fa fa-globe"></i>{ comment.agent }</span>\
            <br if="{ userTail.isMobile }"><br if="{ userTail.isMobile }"> \
          </span> \
        </div> \
        <ol id="ds-ctx" if="{ showDsCtx }"><ds-context-comment each="{ comment, index in parentComments }" hide="{ index && index < comment.parents.length - 1 }" index="{ this.index }" comment="{ this.comment }"></ds-context-comment></ol><p><a class="ds-comment-context" if="{ showDsCtxRef }" data-type="ctx" onmouseenter="{ !isSocial ? bubbleEnter : \'\' }" onmouseleave="{ !isSocial ? bubble.leave : \'\' }" data-post-id="{ comment.post_id }" data-parent-id="{ comment.parent_id }"> { lang.reply_to }{ parentComment.author.name }: </a><ds-comment-message-raw message="{ comment.message }"></ds-comment-message-raw></p><div class="ds-comment-footer ds-comment-actions { \'ds-post-liked\': comment.vote > 0 }"><span if="{ comment.url }"><ds-comment-time-anchor time="{ comment.created_at }" url="{ comment.url }"></ds-comment-time-anchor></span><span if="{ !!!comment.url }"><ds-comment-time-text time="{ comment.created_at }"></ds-comment-time-text></span><ds-reply-comment normal="{ opts.normal }" if="{ !isSocial }"></ds-reply-comment><ds-like-comment if="{ !isSocial }" likes="{ comment.likes }"></ds-like-comment><ds-repost-comment if="{ !isSocial }"></ds-repost-comment><ds-report-comment if="{ !isSocial }"></ds-report-comment><ds-delete-comment if="{ !isSocial }"></ds-delete-comment><ds-weibo-comments comment="{ comment }" if="{ isSocial }"></ds-weibo-comments><ds-weibo-reposts comment="{ comment }" if="{ isSocial }"></ds-weibo-reposts></div><div id="dsInlineReplybox"></div></div></div>  <ul class="ds-children" if="{ showDsChildren }"><ds-comment normal="{ true }" each="{ child in comment.children }" options="{ parent.options }" comment="{ this.child }"></ds-comment></ul></li>', function (t) {
        function e(t) {
          var e = i.comments,
            s = [];
          if (!t || 0 === t.length) return s;
          for (var o = 0; o < t.length; o++) ! function (t) {
            e && e[t] && s.push(e[t])
          }(t[o]);
          return s
        }
        var s = $ds,
          i = this,
          o = (DUOSHUO.API, this.bubble = DUOSHUO.components.bubble),
          n = DUOSHUO.components.thread,
          a = n.tags["ds-comments"].tags["ds-paginator"];
        this.lang = DUOSHUO._lang;
        var r = this.comment = t.comment;
        this.author = t.comment.author, this.on("update", function () {
          var s = this.parent;
          s && this.parent.parent && (this.comments = 1 !== a.current ? s.comments : s.opts.comments, this.options = t.options || this.parent.opts.options), r.parent_id && (this.parentComment = e([r.parent_id])[0]), r.parents && (this.parentComments = e(r.parents));
          var i = this.options || {};
          this.showDsCtx = 1 == i.max_depth && i.show_context && r.parents.length, this.showDsCtxRef = r.parents.length >= i.max_depth && (!i.show_context || i.max_depth > 1) && r.parent_id && this.parentComment, this.showDsChildren = i && i.max_depth > 1 && (r.childrenArray || r.children) && "weibo" != r.source && "qqt" != r.source, this.isSocial = "qqt" == r.source || "weibo" == r.source
        }), this.bubbleEnter = function (t) {
          var e = {};
          e.type = s(t.target).attr("data-type") || "user", e.data = "user" === e.type ? this.author : this.parentComment, "ctx" === e.type && (e.comment = this.comment), o.enter(e, t)
        }.bind(this)
      }), riot.tag("ds-context-comment", '<li class="ds-ctx-entry" if="{ opts.index == 1 && parent.comment.parents.length > 2 }"><a href="javascript:void(0);" onclick="{ expandClick }" class="ds-expand"> 还有{ comment.parents.length - 2 }条评论 </a></li><li class="ds-ctx-entry" if="{ opts.comment }" riot-style="{ opts.hide ? \'display:none\' : \'\' }"><ds-avatar user="{ opts.comment.author }"></ds-avatar><div class="ds-ctx-body"><div class="ds-ctx-head"><ds-comment-user-anchor user="{ opts.comment.author }"></ds-comment-user-anchor><ds-comment-time-anchor time="{ opts.comment.created_at }" url="{ opts.comment.url }"></ds-comment-time-anchor><div class="ds-ctx-nth" if="{ showDsCtxNth() }" title="{ utils.fullTime(opts.comment.created_at) }"> { opts.index + 1 }{ lang.floor } </div></div><div class="ds-ctx-content"><ds-comment-message-raw message="{ opts.comment.message }"></ds-comment-message-raw><div class="ds-comment-actions" if="{ showDsCtxNth() }"><ds-like-comment likes="{ opts.comment.likes }"></ds-like-comment><ds-repost-comment></ds-repost-comment><ds-reply-comment></ds-reply-comment></div></div><div id="dsInlineReplybox"></div></div></li>', function (t) {
        this.utils = DUOSHUO.utils, this.lang = DUOSHUO._lang, this.showDsCtxNth = function () {
          return t.index >= 0
        }.bind(this), this.expandClick = function () {}.bind(this)
      }), riot.tag("ds-reply-comment", '<a href="javascript:void(0);" onclick="{ reply }" class="ds-post-reply"><span class="ds-icon ds-icon-reply"></span>{ lang.reply } </a>', function (t) {
        this.lang = DUOSHUO._lang;
        var e = DUOSHUO.components.thread || (t.normal ? o.parent : o.parent.parent),
          s = e.tags["ds-comments"],
          i = this.parent,
          o = i.parent;
        this.reply = function () {
          o.tags.inlineReplyBox && o.tags.inlineReplyBox.unmount(!0), o.replyboxOpen = !o.replyboxOpen;
          var t = i.comment || i.opts.comment;
          if (o.lastOpenId && o.lastOpenId !== t.post_id && (o.replyboxOpen = !0), o.replyboxOpen) {
            o.lastOpenId = t.post_id;
            var e = {
              commentsTag: s,
              options: o.opts.options,
              thread: o.opts.thread,
              parent_id: t.post_id,
              inline: !0
            };
            o.tags.inlineReplyBox = riot.mount(i.dsInlineReplybox, "ds-reply-box", e)[0]
          }
        }.bind(this)
      }), riot.tag("ds-like-comment", '<a class="ds-post-likes" onclick="{ like }" href="javascript:void(0);"><span class="ds-icon ds-icon-like"></span> { lang.like } <span if="{ likes }">({ likes })</span></a>', function (t) {
        this.lang = DUOSHUO._lang, this.likes = t.likes;
        var e = DUOSHUO.API,
          s = DUOSHUO.utils,
          i = DUOSHUO.utils.dialog;
        this.like = function () {
          if (s.isGuest()) return void i.open("ds-services-list", {
            title: "社交帐号登录",
            style: "width: 300px;"
          });
          var o = this.parent.comment || this.parent.opts.comment,
            n = (t.likes, o.vote > 0),
            a = {};
          a.post_id = o.post_id, a.vote = n ? 0 : 1, e.post("posts/vote", a), this.likes += a.vote ? 1 : -1, o.vote = a.vote, this.parent.update()
        }.bind(this)
      }), riot.tag("ds-repost-comment", '<a class="ds-post-repost" onclick="{ repost }" href="javascript:void(0);"><span class="ds-icon ds-icon-share"></span>{ lang.repost } </a>', function () {
        var t = this;
        this.lang = DUOSHUO._lang;
        var e = this.dialog = DUOSHUO.utils.dialog;
        this.repost = function () {
          var s = {};
          s.comment = this.parent.comment || this.parent.opts.comment, e.open("ds-dialog-reposts", s, function () {
            return DUOSHUO.components.thread ? DUOSHUO.components.thread.update() : void t.parent.parent.parent.parent.update()
          })
        }.bind(this)
      }), riot.tag("ds-report-comment", '<a class="ds-post-report" onclick="{ report }" href="javascript:void(0);"><span class="ds-icon ds-icon-report"></span>{ lang.report } </a>', function () {
        this.lang = DUOSHUO._lang;
        var t = DUOSHUO.API;
        this.report = function () {
          if (!confirm("确定要举报这条评论吗？")) return !1;
          var e = {};
          e.post_id = this.parent.comment.post_id, t.post("posts/report", e), alert("感谢您的反馈！")
        }.bind(this)
      }), riot.tag("ds-delete-comment", '<a class="ds-post-delete" onclick="{ deleteComment }" href="javascript:void(0);" if="{ parent.comment.privileges.delete }"><span class="ds-icon ds-icon-delete"></span>{ lang.delete } </a>', function () {
        var t = $ds;
        this.lang = DUOSHUO._lang;
        var e = DUOSHUO.API,
          s = this.parent.comment,
          i = DUOSHUO.components.thread,
          o = i.tags["ds-comments"];
        this.deleteComment = function () {
          function i() {
            o.removeOne(n.post_id)
          }
          if (!confirm("确定要删除这条评论吗？")) return !1;
          var n = {};
          n.post_id = s.post_id, n.nonce = DUOSHUO.nonce, e.post("posts/remove", n, i), t(this.parent.root).remove()
        }.bind(this)
      }), riot.tag("ds-weibo-comments", '<a class="ds-weibo-comments" href="javascript:void(0);"> { lang.comments } <span class="ds-count" if="{ !!!opts.comment.type.match(/-comment$/) }">({ opts.comment.comments })</span></a>', function (t) {
        this.lang = DUOSHUO._lang, this.comment = function () {
          var e = t.comment;
          0 !== e.root_id
        }.bind(this)
      }), riot.tag("ds-weibo-reposts", '<a class="ds-weibo-reposts" onclick="{ repost }" href="javascript:void(0);"> { lang.reposts } <span class="ds-count" if="{ !!!opts.comment.type.match(/-comment$/) }">({ opts.comment.reposts })</span></a>', function (t) {
        function e(t) {
          return s.authInWinHandler(s[s.isGuest() ? "loginUrl" : "bindUrl"](t)), !1
        }
        this.lang = DUOSHUO._lang;
        var s = DUOSHUO.utils,
          i = DUOSHUO.visitor,
          o = s.dialog;
        this.repost = function () {
          var s = t.comment,
            n = s.source;
          return i.social_uid["qqt" == n ? "qq" : n] ? void o.open("ds-dialog-reposts", {
            comment: t.comment
          }) : e(n)
        }.bind(this)
      }), riot.tag("ds-comment-user-anchor", '<a rel="nofollow author" if="{ opts.user.url }" target="_blank" href="{ utils.encodeHTML(opts.user.url) }">{ utils.encodeHTML(opts.user.name) }</a><span if="{ opts.separator && opts.index && opts.index == 1 }">{ opts.separator }</span> { !!!opts.user.url ? utils.encodeHTML(opts.user.name) : \'\' }', function () {
        this.utils = DUOSHUO.utils, this.lang = DUOSHUO._lang
      }), riot.tag("ds-comment-time-anchor", '<a href="{ opts.url }" if="{ opts.time }" target="_blank" rel="nofollow" class="ds-time" datetime="{ opts.time }" title="{ utils.fullTime(opts.time) }">{ utils.elapsedTime(opts.time) }</a>', function () {
        this.utils = DUOSHUO.utils
      }), riot.tag("ds-comment-time-text", '<span class="ds-time" datetime="{ opts.time }" title="{ timeTitle }">{ timeText }</span>', function (t) {
        var e = this,
          s = DUOSHUO.utils;
        this.on("update", function () {
          this.timeText = s.elapsedTime(t.time), this.timeTitle = s.fullTime(t.time)
        }), setInterval(function () {
          e.timeText = s.elapsedTime(t.time), e.timeTitle = s.fullTime(t.time)
        }, 2e4)
      }), riot.tag("ds-comment-message-raw", "", function (t) {
        this.root.innerHTML = t.message
      }), riot.tag("ds-comments", '<div class="ds-header ds-gradient-bg" if="{ !opts.normal }"> { lang.hot_posts_title } </div><ds-comments-tab if="{ opts.normal }" thread="{ opts.thread }" options="{ opts.options }"></ds-comments-tab><ul class="{ \'ds-comments\': opts.normal }"><ds-comment if="{ !opts.normal || (opts.normal && opts.thread.comments) }" normal="{ parent.opts.normal }" each="{ id, comment in commentsLoop }" comment="{ this.comment }"></ds-comment><ds-comments-placeholder if="{ opts.normal && !opts.thread.comments }"></ds-comments-placeholder></ul><ds-paginator name="dsPager" if="{ opts.normal && opts.thread.comments && cursor && cursor.pages != 1 }" cursor="{ cursor }"></ds-paginator>', function (t) {
        function e(t, e) {
          if (t && e) {
            var s = {};
            return _.each(t, function (t) {
              e[t] && (s[t] = e[t])
            }), s
          }
        }
        this.lang = DUOSHUO._lang;
        var s = this.tags["ds-comments-tab"];
        this.on("update", function () {
          this.cursor = this.cursor || t.cursor, this.commentsids || (this.commentsids = t.commentsids), this.comments || (this.comments = t.comments), this.commentsLoop = e(this.commentsids, this.comments)
        }), this.prepend = function (t) {
          var e = t.post_id;
          this.commentsids.unshift(e), this.comments[e] = t, this.update(), s.count(1)
        }.bind(this), this.append = function (t) {
          var e = t.post_id;
          this.commentsids.push(e), this.comments[e] = t, this.update(), s.count(1)
        }.bind(this), this.addOne = function (e) {
          t.options && this["desc" === t.options.order ? "prepend" : "append"](e)
        }.bind(this), this.removeOne = function (t) {
          this.comments[t] = null, this.update(), s.count(-1)
        }.bind(this)
      }), riot.tag("ds-comments-tab", '<div class="ds-comments-info"><div class="ds-sort"><a class="ds-order-desc { \'ds-current\': current.order == \'desc\' }" data-v="desc" data-type="order" onclick="{ change }">{ lang.latest }</a><a class="ds-order-asc { \'ds-current\': current.order == \'asc\' }" data-v="asc" data-type="order" onclick="{ change }">{ lang.earliest }</a><a class="ds-order-hot { \'ds-current\': current.order == \'hot\' }" data-v="hot" data-type="order" onclick="{ change }">{ lang.hottest }</a></div><ul class="ds-comments-tabs" id="dsCommentsTabs"><li class="ds-tab"><a class="ds-comments-tab-duoshuo { \'ds-current\': current.source == \'duoshuo\' }" href="javascript:void(0);" data-type="source" data-v="duoshuo" onclick="{ change }" ><span class="ds-highlight">{ thread.comments }</span> 条评论</a></li><li class="ds-tab" if="{ opts.options.show_reposts && thread.reposts }"><a class="ds-comments-tab-repost { \'ds-current\': current.source == \'reposts\' }" href="javascript:void(0);"><span class="ds-highlight">{ thread.reposts }</span> 条评论</a></li><li class="ds-tab" if="{ opts.options.show_weibo && thread.weibo_reposts }"><a class="ds-comments-tab-weibo { \'ds-current\': current.source == \'weibo\' }" href="javascript:void(0);" data-type="source" onclick="{ change }" data-v="weibo"><span class="ds-highlight">{ thread.weibo_reposts }</span> 条新浪微博</a></li><li class="ds-tab" if="{ opts.options.show_qqt && thread.qqt_reposts }"><a class="ds-comments-tab-qqt { \'ds-current\': current.source == \'qqt\' }" href="javascript:void(0);" data-type="source" onclick="{ change }" data-v="qqt"><span class="ds-highlight">{ thread.qqt_reposts }</span> 条腾讯微博</a></li></ul></div>', ".ds-hide { display: none; }", function (e) {
        function s(t) {
          function e(t) {
            return n.indicator.hide(), 0 !== t.code ? s.handleError(t.errorMessage, t.code) : void o.parent.update({
              commentsids: t.response,
              comments: t.parentPosts,
              cursor: t.cursor
            })
          }
          var s = o.parent.parent;
          s.fetch(t, e), n.indicator.show()
        }
        var i = $ds,
          o = (t._dom, this),
          n = DUOSHUO.utils;
        this.lang = DUOSHUO._lang, this.current = {}, this.on("update", function () {
          this.thread || (this.thread = e.thread), e.options && (this.current.source || (this.current.source = e.options.source || "duoshuo"), this.current.order || (this.current.order = e.options.order || "desc"))
        }), this.count = function (t, e) {
          this.thread[e || "comments"] += t, this.update()
        }.bind(this), this.change = function (t) {
          var o = this.parent.tags["ds-paginator"],
            n = t.target.getAttribute("data-type"),
            a = t.target.getAttribute("data-v");
          this.current[n] = a, "source" === n && i("#dsReplyBoxBlock")["duoshuo" !== a ? "addClass" : "removeClass"]("ds-hide");
          var r = {};
          r.page = "order" === n ? o.current : 1, r.source = this.current.source, r.order = this.current.order, r.max_depth = e.options.max_depth || 1, r.limit = e.options.limit || 50, s(r), "source" === n && (o.current = 1, o.update())
        }.bind(this)
      }), riot.tag("ds-comments-placeholder", '<li class="ds-post ds-post-placeholder"> { lang.no_comments_yet } </li>', function (t) {
        this.lang = t.lang || DUOSHUO._lang
      }), riot.tag("ds-dialog", '<div id="ds-wrapper" show="{ show }"><div riot-style="{ dialogOptions.style }" class="ds-dialog { dialogOptions.class }" id="ds-reset"><div class="ds-dialog-inner ds-rounded"><div class="ds-dialog-body" riot-style="{ dialogOptions.bodyStyle }" id="dsDialogContent"></div><div class="ds-dialog-footer"><a href="http://duoshuo.com/" target="_blank" class="ds-logo"></a><span>社会化评论框</span></div><a class="ds-dialog-close" onclick="{ dialog.close }" href="javascript:void(0)" title="关闭"></a></div></div></div>', function () {
        var t = this;
        this.dialog = DUOSHUO.utils.dialog, DUOSHUO.on("dialogOpen", function (e) {
          t.dialogOptions = e || {}, t.show = !0, t.update()
        }), DUOSHUO.on("dialogClose", function () {
          t.show = !1, t.update()
        })
      }), riot.tag("ds-dialog-anonymous", '<h2>社交帐号登录</h2><div class="ds-icons-32"><a class="ds-{ this.s }" onclick="{ parent.utils.authClick }" each="{ s in services }" href="{ parent.utils.loginUrl(s) }"> { parent.sourceName[s] } </a></div><h2 if="{ !opts.options.deny_anonymous }">作为游客留言</h2><form method="post" if="{ !opts.options.deny_anonymous }" onsubmit="{ submitMessage }"><div class="ds-control-group"><input type="text" name="author_name" value="{ visitor.name }" required><label for="ds-dialog-name">名字(必填)</label></div><div class="ds-control-group" if="{ opts.options.require_guest_email }"><input type="email" name="author_email" value="{ visitor.email }" required><label for="ds-dialog-email">邮箱(必填)</label></div><div class="ds-control-group" if="{ opts.options.require_guest_url }"><input type="url" name="author_url" placeholder="http://" value="{ visitor.url }"><label for="ds-dialog-url">网址(可选)</label></div><button type="submit">发布</button></form>', function (t) {
        this.utils = DUOSHUO.utils, this.visitor = DUOSHUO.visitor, this.sourceName = DUOSHUO.constents.sourceName, this.services = ["weibo", "qq", "renren", "kaixin", "douban"], this.on("mount", function () {
          this.author_name.focus()
        }), this.submitMessage = function () {
          var e = this.author_email.value;
          return !e && !t.options.require_guest_email || e.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? (t.submit({
            author_name: this.author_name.value,
            author_email: this.author_email.value,
            author_url: this.author_url.value
          }), void this.utils.dialog.close()) : this.utils.errors.handle("missing_email", {
            showAlert: !0
          })
        }.bind(this)
      }), riot.tag("ds-dialog-ctx-comments", '<h2>查看对话</h2><ol id="ds-ctx"><ds-context-comment each="{ comment, index in opts.comments }" index="{ this.index }" comment="{ this.comment }"></ds-context-comment></ol>', function () {}), riot.tag("ds-dialog-qrcode", '<h2>微信扫一扫，分享到朋友圈</h2><div class="ds-share-qrcode" style="text-align:center;"><img riot-src="{ opts.qrcode_url }" alt="{ opts.url }"></div>', function () {}), riot.tag("ds-dialog-reposts", '<h2>转发到微博</h2><div class="ds-quote"><strong>@{ comment.author.name }</strong>: <ds-comment-message-raw message="{ comment.message }"></ds-comment-message-raw></div><form id="repostForm" onsubmit="{ submitRepost }"><div class="ds-textarea-wrapper"><textarea name="message" title="Ctrl + Enter 快捷提交" placeholder="{ lang.repost_reason }">{ opts.repostMessage || \'\' }</textarea><pre class="ds-hidden-text"></pre></div><div class="ds-actions"><label if="{ !opts.service }"><input type="checkbox" name="service[]" value="weibo" __checked="{ shareVia.weibo }" onclick="{ toggleCheck }"><span class="ds-service-icon ds-weibo"></span>新浪微博 </label><label if="{ !opts.service }"><input type="checkbox" name="service[]" value="qqt" __checked="{ shareVia.qqt }" onclick="{ toggleCheck }"><span class="ds-service-icon ds-qqt"></span>腾讯微博 </label><button type="submit">{ lang.repost }</button></div></form>', function (t) {
        function e(t) {
          var e = [];
          return Object.keys(t).forEach(function (s) {
            t[s] === !0 && e.push(s)
          }), e[0] || ""
        }
        var s = DUOSHUO.API,
          i = DUOSHUO.utils,
          o = i.dialog;
        this.lang = DUOSHUO._lang, this.service = t.service, this.comment = t.comment, this.shareVia = {}, this.on("mount", function () {
          DUOSHUO.visitor && (this.shareVia.weibo = !!DUOSHUO.visitor.social_uid.weibo, this.shareVia.qqt = !!DUOSHUO.visitor.social_uid.qq, this.update())
        }), this.toggleCheck = function (t) {
          var e = t.target.value;
          return this.shareVia[e] = !this.shareVia[e], !0
        }.bind(this), this.submitRepost = function () {
          function t() {}
          if (!this.service && !this.shareVia.weibo && !this.shareVia.qqt) return i.errors.handle("missing_share_type", {
            showAlert: !0
          });
          var n = {};
          n.post_id = this.comment.post_id, n.message = this.message.value, n["service[]"] = e(this.shareVia), n.nonce = DUOSHUO.nonce, s.post("posts/repost", n, t), o.close()
        }.bind(this)
      }), riot.tag("ds-dialog-unread-comments", '<h2>新留言及回复</h2><ul class="ds-unread-list"><li each="{ comment,index in comments }" hide="{ this.removed }"><ds-comment-user-anchor each="{ author,index in comment.authors }" index="{ this.index }" user="{ this.author }" separator="、"></ds-comment-user-anchor> 在 <a class="ds-read" href="{ comment.thread.url + \'#comments\'}" target="_blank"> { comment.thread.title || \'无标题\' } </a> 中回复了你 <a class="ds-delete ds-read" data-thread-id="{ comment.thread.thread_id }" onclick="{ read }" title="知道了" href="javascript:void(0)">知道了</a></li></ul>', function () {
        function t(t) {
          s.comments = t.response, s.update()
        }
        var e = $ds,
          s = this,
          i = DUOSHUO.API;
        i.get("users/unreadComments", {}, t), this.read = function (t) {
          t.item.removed = !0;
          var s = {};
          s.thread_id = e(t.target).attr("data-thread-id"), i.post("threads/read", s)
        }.bind(this)
      }), riot.tag("ds-dialog-unread-notifications", '<h2>系统消息</h2><ul class="ds-unread-list"><li each="{ notification in notifications }" hide="{ this.removed }"><ds-dialog-message-raw message="{ notification.content }"><ds-dialog-message-raw><a class="ds-delete ds-read" data-notification-id="{ notification.notification_id }" onclick="{ read }" title="知道了" href="javascript:void(0)">知道了</a></li></ul>', function () {
        function t(t) {
          s.notifications = t.response, s.update()
        }
        var e = $ds,
          s = this,
          i = DUOSHUO.API;
        i.get("users/unreadNotifications", {}, t), this.read = function (t) {
          t.item.removed = !0;
          var s = {};
          s.notification_id = e(t.target).attr("data-notification-id"), i.post("notifications/read", s)
        }.bind(this)
      }), riot.tag("ds-dialog-message-raw", "", function (t) {
        this.root.innerHTML = t.message
      }), riot.tag("ds-error", '<p if="{ opts.error }">评论框出错啦({ opts.error.code }): { opts.error.message }</p>', function () {}), riot.tag("ds-indicator", '<div id="ds-indicator" style="display: block;"></div>', function () {}), riot.tag("ds-waiting", '<div id="ds-waiting"></div>', function () {}), riot.tag("ds-login", '<div id="ds-login" class="ds-login ds-icons-32"><a each="{ service in services }" onclick="{ parent.utils.authClick }" class="ds-{ service }" href="{ parent.loginUrl(service) }">{ parent.sourceName[service] }</a></div>', function (t) {
        this.utils = DUOSHUO.utils, this.sourceName = DUOSHUO.sourceName, this.loginUrl = this.utils.loginUrl, this.on("update", function () {
          this.services = t.services ? t.services.split(",") : ["weibo", "qq", "renren", "kaixin", "douban"]
        })
      }), riot.tag("ds-login-buttons", '<div class="ds-login-buttons"><p>社交帐号登录：</p><div class="ds-social-links"><ul class="ds-service-list"><ds-services services="{ cs }"></ds-services><li><a class="ds-more-services" onclick="{ toggle }" href="javascript:void(0)">更多 &raquo;</a></li></ul><ul riot-style="{ makeStyle(show) }" class="ds-service-list ds-additional-services clearfix"><ds-services services="{ as }"></ds-services></ul></div></div>', function () {
        this.cs = ["weibo", "qq", "renren", "douban"], this.as = ["kaixin", "baidu", "google"], this.show = !1, this.toggle = function () {
          this.show = !this.show
        }.bind(this), this.makeStyle = function (t) {
          return t ? "display: block" : "display: none"
        }.bind(this)
      }), riot.tag("ds-meta", '<div class="ds-meta" if="{ opts.options.like_thread_enabled && !utils.isGuest() }"><a href="javascript:void(0)" onclick="{ like }" class="ds-like-thread-button ds-rounded { \'ds-thread-liked\' : status.liked }"><span class="ds-icon ds-icon-heart"></span><span class="ds-thread-like-text"> { status.liked ? \'已喜欢\' : \'喜欢\' }</span><span class="ds-thread-cancel-like">取消喜欢</span></a><span class="ds-like-panel" if="{ thread.likes }"><span class="ds-highlight">{ thread.likes }</span> 人喜欢 </span></div><ds-like-tootip enable="{ status.enableTooltip }" threadid="{ thread.thread_id }"></ds-like-tootip>', function (t) {
        this.status = {}, this.thread = t.thread, this.utils = DUOSHUO.utils;
        var e = DUOSHUO.API;
        this.on("update", function () {
          this.thread = t.thread, this.status.liked = this.thread && this.thread.user_vote > 0
        }), DUOSHUO.updateWhenReady(this), this.like = function () {
          if (this.thread) {
            var t = {};
            t.thread_id = this.thread.thread_id, t.vote = this.status.liked ? 0 : 1, e.post("threads/vote", t), this.status.liked = !this.status.liked, this.thread.user_vote = t.vote, this.status.liked ? (this.status.enableTooltip = !0, this.thread.likes += 1) : this.thread.likes -= 1
          }
        }.bind(this)
      }), riot.tag("ds-like-tootip", '<div class="ds-like-tooltip ds-rounded" show="{ opts.enable }" riot-style="{ styles }"><p>很高兴你能喜欢，分享一下吧：</p><ul><li each="{ service, item in services }"><a class="ds-service-link ds-share-to-{ service } ds-{ service } }" href="{ item.link }"> { item.text } </a></li></ul><p class="ds-like-tooltip-footer"><a class="ds-like-tooltip-close" onclick="{ cancel }">算了</a></p></div>', function () {
        var t = this,
          e = DUOSHUO.utils,
          s = {
            qzone: "QQ空间",
            weibo: "新浪微博",
            qqt: "腾讯微博",
            renren: "人人网",
            kaixin: "开心网",
            douban: "豆瓣网",
            baidu: "百度搜藏",
            netease: "网易微博",
            sohu: "搜狐微博"
          };
        this.services = {}, this.styles = "left: 0px; top: 35px; display: none;", this.on("update", function () {
          Object.keys(s).forEach(function (i) {
            t.services[i] = {
              text: s[i],
              link: e.hostUrl() + "/share-proxy/?" + _.param({
                service: i,
                thread_id: t.opts.threadid
              })
            }
          })
        }), this.cancel = function () {
          this.parent.status.enableTooltip = !1, this.parent.update()
        }.bind(this)
      }), riot.tag("ds-notify", '<div id="ds-notify" riot-style="{ positions(position) }"><div id="ds-reset"><a class="ds-logo" href="http://duoshuo.com/" target="_blank" title="多说"></a><ul class="ds-notify-unread"><li if="{ unread.comments }"><a href="javascript:void(0);" data-type="comments" onclick="{ openDialog }"> 你有{ unread.comments || 0 }条新回复 </a></li><li if="{ unread.notifications }"><a href="javascript:void(0);" data-type="notifications" onclick="{ openDialog }"> 你有{ unread.notifications || 0 }条系统消息 </a></li></ul></div></div>', function (t) {
        var e = $ds,
          s = (DUOSHUO.utils, this.dialog = DUOSHUO.utils.dialog);
        DUOSHUO.updateWhenReady(this), this.on("update", function () {
          this.unread = t.unread || DUOSHUO.unread, this.position = DUOSHUO.site.notify_position || null, this.allClear = this.unread ? !this.unread.comments && !this.unread.notifications : !0
        }), this.openDialog = function (t) {
          s.open("ds-dialog-unread-" + e(t.target).attr("data-type")), this.hide()
        }.bind(this), this.positions = function (t) {
          return (this.forcedHide || this.allClear) && (t = "hidden"), {
            hidden: "display: none;",
            "top-right": "top: 24px; right: 24px",
            "bottom-right": "bottom: 24px; right: 24px"
          }[t || "hidden"]
        }.bind(this), this.hide = function () {
          this.forcedHide = !0, this.update()
        }.bind(this)
      }), riot.tag("ds-paginator", '<div class="ds-paginator"><div class="ds-border"></div><a href="javascript:void(0);" data-page="{ 1 }" onclick="{ jump }" if="{ showFirstPage }" class="{ \'ds-current\': current == 1 }">1</a><span class="page-break" if="{ current > 3 }">...</span><span><a href="javascript:void(0);" each="{ n in pages }" data-page="{ this.n }" onclick="{ parent.jump }" if="{ n <= parent.edge && n > parent.leftEdge }" class="{ \'ds-current\': parent.current == this.n }">{ n }</a></span><span class="page-break" if="{ hideMore }">...</span><a href="javascript:void(0);" onclick="{ jump }" data-page="{ pages[pages.length - 1] }" class="{ \'ds-current\': current == pages[pages.length - 1] }" if="{ hideMore }">{ pages[pages.length - 1] }</a></div>', function (t) {
        function e(t) {
          for (var e = [], s = 0; t > s; s++) e.push(s + 1);
          return e
        }
        var s = $ds,
          i = this.parent.parent,
          o = DUOSHUO.utils;
        this.leftEdge = 1, this.edge = t.edge || 5, this.on("update", function () {
          t.cursor && (!t.cursor.pages || t.cursor.pages <= 1 || (this.showFirstPage = t.cursor.pages > 1, this.hideMore = t.cursor.pages > 5, this.pages = e(t.cursor.pages), this.current || (this.current = 1), this.current >= this.edge - 1 && (this.edge += 1, this.leftEdge += 1)))
        }), this.jump = function (t) {
          function e(t) {
            return o.indicator.hide(), 0 !== t.code ? i.handleError(t.errorMessage, t.code) : void i.tags["ds-comments"].update({
              commentsids: t.response,
              comments: t.parentPosts
            })
          }
          this.current = s(t.target).attr("data-page"), this.update(), o.indicator.show();
          var n = {};
          n.page = this.current, i.fetch(n, e)
        }.bind(this)
      }), riot.tag("ds-powered-by", '<p class="ds-powered-by"><a href="http://duoshuo.com" target="_blank" rel="nofollow"> { utils.encodeHTML(opts.options.poweredby_text) } </a></p>', function () {
        this.utils = DUOSHUO.utils
      }), riot.tag("ds-reply-box", '<div id="{ opts.inline ? \'dsReplyBoxInline\' : \'dsReplyBoxBlock\' }" class="ds-replybox {\'ds-inline-replybox\': opts.inline }">  <ds-avatar-visitor user="{ visitor }"></ds-avatar-visitor>  <form id="dsReplyForm" onsubmit="{ submitMessage }" method="post">  <div class="ds-textarea-wrapper ds-rounded-top"><textarea name="message" id="dsMessageTextarea" title="Ctrl + Enter 快捷提交" onkeyup="{ backup }" onblur="{ backup }" onfocus="{ backup }" placeholder="{ lang.leave_a_message }"></textarea>  <pre class="ds-hidden-text"></pre></div>  <div class="ds-post-toolbar"><div class="ds-post-options ds-gradient-bg"><span class="ds-sync" if="{ !utils.isGuest() && repostMap }"><input id="{ opts.inline ? \'ds-sync-checkbox-inline\' : \'ds-sync-checkbox\' }" type="checkbox" name="repost" onchange="{ recheck }" __checked="{ checked }" value="{ repostArray.join(\',\') }"><label for="{ opts.inline ? \'ds-sync-checkbox-inline\' : \'ds-sync-checkbox\' }"> { lang.share_to } </label><ds-service-icon togglemode="{ true }" each="{ service, exist in repostMap }" service="{ this.service }" grey="{ !exist }"></ds-service-icon></span></div>  <button class="ds-post-button { \'ds-waiting\': status.submitting }" __disabled="{ !message || status.submitting }" name="submit" type="submit"> { status.submitting ? lang.posting : lang.post } </button>  <div class="ds-toolbar-buttons"><a if="{ opts.options.use_smilies }" class="ds-toolbar-button ds-add-emote" onclick="{ loadSmilies }" title="插入表情"></a><a if="{ opts.options.use_images && options.parse_html_enabled }" onclick="{ addImage }" class="ds-toolbar-button ds-add-image" title="插入图片"></a></div></div></form></div>', function (s) {
        var i, o = $ds,
          n = this,
          a = this.utils = DUOSHUO.utils,
          r = (a.events, DUOSHUO.API),
          d = this.submit,
          c = this.dialog = a.dialog;
        this.lang = DUOSHUO._lang, this.status = {}, this.on("update", function () {
          if (this.thread = s.thread, this.options = s.options, this.visitor = DUOSHUO.visitor, this.thread && this.thread.thread_id && (this.storageKey = "ds_draft_" + this.thread.thread_id), !s.inline && localStorage && localStorage[this.storageKey] && (this.message.value = localStorage[this.storageKey]), this.visitor.user_id && !this.repostMap) {
            this.repostMap = {};
            for (var t in this.visitor.repostOptions) n.repostMap[t] = this.visitor.repostOptions[t], n.repostMap[t] && (n.checked = 1)
          }
        }), DUOSHUO.updateWhenReady(this), this.on("mount", function () {
          this.message.focus()
        }), riot.observable(this.submit), d.on("submitting", function () {
          n.status.submitting = !0, n.update()
        }), d.on("submitted", function () {
          n.status.submitting = !1, n.update()
        }), this.backup = function (t) {
          if (t.ctrlKey && 13 == t.which || 10 == t.which) return this.submitMessage();
          if (!s.inline && localStorage) try {
            localStorage[this.storageKey] = this.message.value
          } catch (t) {}
        }.bind(this), this.recheck = function (t) {
          var e = t.target;
          e.value = this.checking(e.checked)
        }.bind(this), this.checking = function (t) {
          var e = this.repostMap,
            s = [];
          return Object.keys(e).forEach(function (i) {
            "undefined" != typeof t && (e[i] = t), e[i] === !0 && s.push(i)
          }), s.join(",")
        }.bind(this), this.submitMessage = function () {
          function t(t) {
            function e(t) {
              var e = n.options;
              d.trigger("submitted"), n.message.value = "";
              var s = n.opts.commentsTag || n.parent.tags["ds-comments"];
              if (s["desc" === e.order ? "prepend" : "append"](t.response), "asc" == e.order == ("top" == e.formPosition)) {
                var i = o("#ds-post-" + t.response.post_id).offset();
                a.scrollTo(i.top + i.height - 40, 300)
              }
              if (localStorage) try {
                localStorage.removeItem("ds_draft_" + n.thread.thread_id)
              } catch (r) {}
            }

            function s(t) {
              d.trigger("submitted"), alert(t.errorMessage)
            }
            d.trigger("submitting");
            var i = {
              message: n.message.value,
              thread_id: n.opts.thread.thread_id,
              parent_id: n.opts.parent_id || "",
              nonce: DUOSHUO.nonce
            };
            n.repost.value && (i.repost = n.repost.value), t && _.extend(i, t), r.post("posts/create", i, e, s)
          }
          if (this.status.submitting) return !1;
          var e = this.message,
            s = e.value.trim(),
            i = DUOSHUO.environment.supports;
          if (!s || "" == s || !i.placeholder && s == e.getAttribute("placeholder")) return a.errors.handle("missing_message", {
            showAlert: !0
          });
          if (a.isGuest()) return void c.open("ds-dialog-anonymous", {
            style: "width: 320px",
            options: n.options,
            submit: t
          });
          try {
            t()
          } catch (l) {
            console.error(l)
          }
        }.bind(this), this.loadSmilies = function () {
          var s = (t._dom, n.message),
            o = s.getBoundingClientRect();
          DUOSHUO.require("smilies", function () {
            DUOSHUO.status.showSmilies = !0;
            var t = {};
            t.position = {
              top: o.top + e.body.scrollTop + s.offsetHeight + 34 + "px",
              left: o.left + e.body.scrollLeft + "px"
            }, i && i.unmount(), i = a.mountTag("smilies", t)
          })
        }.bind(this), this.addImage = function () {
          var t = n.dsMessageTextarea,
            s = t.value,
            i = "请输入图片地址",
            o = '<img src="' + i + '" />';
          if (e.selection) {
            t.value = s.substring(0, textarea.data("ds-range-start")) + o + s.substring(textarea.data("ds-range-end"), s.length), t.value = t.value.replace("说点什么吧 ...", ""), t.focus();
            var a = e.selection.createRange();
            a.collapse(), a.findText(i), a.select()
          } else {
            t.value = s.substring(0, t.selectionStart) + o + s.substring(t.selectionEnd);
            var r = t.value.search(i);
            t.setSelectionRange(r, r + i.length), t.focus()
          }
        }.bind(this)
      }), riot.tag("ds-services", '<li each="{ s in services }"><a href="{ parent.opts.bindlist ? parent.utils.bindUrl(s) : parent.utils.loginUrl(s) }" rel="nofollow" onclick="{ parent.utils.authClick }" class="ds-service-link ds-{ s }"> { parent.serviceNames[s] } <span if="{ parent.opts.bindlist && parent.visitor.social_uid[s] }" class="ds-icon ds-icon-ok"></span></a></li>', function (t) {
        this.utils = DUOSHUO.utils, this.visitor = DUOSHUO.visitor, this.services = t.services, this.serviceNames = DUOSHUO.constents.serviceNames
      }), riot.tag("ds-services-list", '<h2>{ title }</h2><ul class="ds-service-list"><ds-services services="{ cs }" bindlist="{ opts.bindlist || false }"></ds-services></ul><ul class="ds-service-list ds-additional-services"><ds-services services="{ as }" bindlist="{ opts.bindlist || false }"></ds-services></ul><div style="clear:both" if="{ opts.bindlist }"></div>', function (t) {
        this.cs = ["weibo", "qq", "renren", "douban"], this.as = ["kaixin", "baidu", "google"], this.title = t.title
      }), riot.tag("ds-service-icon", '<a href="javascript:void(0)" if="{ sourceName[opts.service] }" class="ds-service-icon{ grey ? \'-grey\' : \'\' } ds-{ opts.service }" onclick="{ opts.togglemode ? toggle : \'javascript:void(0);\'}" data-service="{ opts.service }" title="{ sourceName[opts.service] }" ></a>', function (t) {
        this.sourceName = DUOSHUO.constents.sourceName, this.on("update", function () {
          "undefined" == typeof this.grey && (this.grey = t.grey)
        }), this.toggle = function () {
          var e = this.parent,
            s = e.repost;
          this.grey = !this.grey, e.repostMap[t.service] = !this.grey, s.value = e.checking(), s.checked = "" != s.value
        }.bind(this)
      }), riot.tag("ds-smilies", '<div id="ds-smilies-tooltip" riot-style="{ styles }"><ul class="ds-smilies-tabs"><li each="{ smilieType, smilies in smiliesMap }"><a onclick="{ parent.renderSmilies }" class="{ \'ds-current\': smilieType == parent.targetType }" data-type="{ smilieType }" href="javascript:void(0);"> { smilieType } </a></li></ul><div class="ds-smilies-container"><ul if="{ smiliesMap && targetType }"><li each="{ shortCut, imageURI in smiliesMap[targetType] }"><img onclick="{ parent.insertSmilie }" title="{ parent.parseTitle(shortCut) }" riot-src="{ parent.parseSmilie(shortCut, imageURI) }"></li></ul></div></div>', function (t) {
        this.styles = "display: none;", t.position && (this.styles += "top:" + t.position.top + ";", this.styles += "left:" + t.position.left, this.styles += "; overflow: hidden;"), this.on("update", function () {
          this.smiliesMap = DUOSHUO.smilies, this.styles = DUOSHUO.status.showSmilies ? this.styles.replace("none;", "block;") : this.styles.replace("block;", "none;"), this.smiliesMap && !this.targetType && (this.targetType = "微博-默认")
        }), this.parseSmilie = function (t, e) {
          var s = "http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/";
          return 0 === this.targetType.indexOf("微博") ? s + e.replace("_org", "_thumb") : DUOSHUO.STATIC_URL + "/images/smilies/" + e
        }.bind(this), this.parseTitle = function (t) {
          return "WordPress" === this.targetType && (t = " " + t + " "), t
        }.bind(this), this.renderSmilies = function (t) {
          var e = t.target.getAttribute("data-type");
          this.targetType = e
        }.bind(this), this.insertSmilie = function (t) {
          var s = e.getElementById("dsMessageTextarea"),
            i = s,
            o = i.value,
            n = t.item.shortCut;
          if (e.selection) {
            i.value = o.substring(0, s.data("ds-range-start")) + n + o.substring(s.data("ds-range-end"), o.length), i.value = i.value.replace(lang.leave_a_message, ""), i.focus();
            var a = e.selection.createRange();
            a.moveStart("character", s.data("ds-range-start") + n.length), a.collapse(), a.select()
          } else {
            var r = i.selectionStart + n.length;
            i.value = o.substring(0, i.selectionStart) + n + o.substring(i.selectionEnd), i.setSelectionRange(r, r)
          }
          DUOSHUO.status.showSmilies = !1, i.focus()
        }.bind(this)
      }), riot.tag("ds-thread", '<div id="ds-thread"><div id="ds-reset" show="{ ready }">  <ds-meta options="{ data.options }" thread="{ data.thread }"></ds-meta>  <ds-hot-comments if="{ data.options.hot_posts && data.hotPosts.length }" thread="{ data.thread }" comments="{ data.parentPosts }" commentsids="{ data.hotPosts }" options="{ data.options }"></ds-hot-comments>  <a name="respond"></a>  <ds-toolbar></ds-toolbar>  <ds-reply-box if="{ data.options && data.options.formPosition == \'top\' }" options="{ data.options }" thread="{ data.thread }"></ds-reply-box>  <ds-comments normal="{ true }" comments="{ data.parentPosts }" commentsids="{ data.response }" thread="{ data.thread }" cursor="{ data.cursor }" options="{ data.options }"></ds-comments>  <ds-reply-box if="{ data.options && data.options.formPosition == \'bottom\'}" options="{ data.options }" thread="{ data.thread }"></ds-reply-box><ds-powered-by options="{ data.options }"></ds-powered-by><ds-error error="{ error }"></ds-error></div><ds-waiting if="{ !!!ready }"></ds-waiting></div>  <ds-notify></ds-notify>  <ds-dialog></ds-dialog>', function (t) {
        function s(t) {
          return 0 !== t.code ? o.handleError(t.errorMessage, t.code) : (r.bubble = a.mountTag("bubble", {}, e.getElementById("ds-reset")), o.ready = !0, o.data = t, void o.update())
        }
        var i = $ds,
          o = this,
          n = DUOSHUO.API,
          a = DUOSHUO.utils,
          r = DUOSHUO.components,
          d = "thread-id local-thread-id source-thread-id thread-key category channel-key author-key author-id url limit order max-depth form-position container-url title image thumbnail";
        if (this.data = {}, this.ready = !1, "请将此处替换成文章在你的站点中的ID" === t["data-thread-key"]) return a.errors.handle("missing_thread_key", {
          showAlert: !0
        });
        var c = t["data-url"] || !t["data-thread-id"] && i("link[rel=canonical]").attr("href");
        c ? t["data-url"] = a.resolveUrl(c) : t["data-container-url"] = location.href, this.fetch = function (e, i) {
          var o = _.extend({}, a.formatQuery(d, t));
          n.get("threads/listPosts", a.backgroundParams(_.extend(o, e || {})), i || s)
        }.bind(this), this.fetch(), this.handleError = function (t, e) {
          o.error = {
            code: e,
            message: t
          }, o.ready = !0, o.update()
        }.bind(this)
      }), riot.tag("ds-toolbar", '<div class="ds-toolbar"><div class="ds-account-control" if="{ !utils.isGuest() }" onmouseenter="{ toggleAccount }" onmouseleave="{ toggleAccount }"><span class="ds-icon ds-icon-settings"></span><span>帐号管理</span><ul><li><a class="ds-bind-more" onclick="{ openDialogBindMore }" href="javascript:void(0);" style="border-top: none">绑定更多</a></li><li><a target="_blank" href="{ uri.settings }">{ lang.settings }</a></li><li><a rel="nofollow" href="{ utils.logoutUrl() }" style="border-bottom: none">登出</a></li></ul></div><div class="ds-visitor" if="{ !utils.isGuest() }"><a class="ds-visitor-name" if="{ visitor.url }" href="{ visitor.url }" target="_blank"> { visitor.name } </a><span class="ds-visitor-name" if="{ !visitor.url }"> { visitor.name } </span><a class="ds-unread-comments-count" if="{ unread.comments }" riot-style="{ inlineCountsStyle }" href="javascript:void(0);" data-type="comments" onclick="{ openDialogUnreadComments }" title="{ title }">{ unread.comments || 0 }</a></div><ds-login-buttons if="{ utils.isGuest() }"></ds-login-buttons></div>', function () {
        var t = $ds,
          e = this.utils = DUOSHUO.utils,
          s = this.dialog = e.dialog;
        this.uri = {}, this.uri.settings = DUOSHUO.REMOTE + "/settings/" + e.queryIfNecessary(e.jwtParam()), this.lang = DUOSHUO._lang, this.on("update", function () {
          this.visitor = DUOSHUO.visitor, this.unread = this.opts.unread || DUOSHUO.unread, this.updateTitle()
        }), DUOSHUO.updateWhenReady(this), this.updateTitle = function () {
          this.unread && (this.title = this.unread.comments > 0 ? "你有" + this.unread.comments + "条新回复" : "你没有新回复", this.unread.comments > 0 && (this.inlineCountsStyle = "display: inline;"))
        }.bind(this), this.toggleAccount = function (e) {
          t(e.target)["mouseenter" === e.type ? "addClass" : "removeClass"]("ds-active")
        }.bind(this), this.openDialogBindMore = function () {
          s.open("ds-services-list", {
            title: "绑定更多帐号",
            bindlist: !0,
            style: "width: 300px"
          })
        }.bind(this), this.openDialogUnreadComments = function () {
          s.open("ds-dialog-unread-comments"), this.parent.tags["ds-notify"].hide()
        }.bind(this)
      }), riot.tag("ds-hot-comments", ' <div id="ds-hot-posts" class="ds-rounded">  <ds-comments thread="{ opts.thread }" comments="{ opts.comments }" commentsids="{ opts.commentsids }" options="{ opts.options }"></ds-comments></div>', function () {}), riot.tag("ds-recent-comments", '<div id="ds-recent-comments"><li each="{ comments }" class="ds-comment { \'ds-show-avatars\' : parent.opts.show_avatars || parent.defaults.show_avatars }" data-post-id="{ post_id }"><ds-avatar if="{ parent.opts.show_avatars || parent.defaults.show_avatars }" user="{ author }" size="{ parent.opts.avatar_size || parent.defaults.avatar_size }"></ds-avatar><div class="ds-meta"><ds-comment-user-anchor user="{ author }"></ds-comment-user-anchor><ds-comment-time-text if="{ parent.opts.show_time || parent.defaults.show_time }" time="{ created_at }"></ds-comment-time-text></div><div class="ds-thread-title" if="{ parent.opts.show_title || parent.defaults.show_title }">在 <a href="{ thread.url }#comments">{ thread.title }</a> 中评论</div><div class="ds-excerpt">{ message }</div><a if="{ !!!parent.opts.show_title && !!!parent.defaults.show_title }" class="ds-excerpt" title="{ thread.title } 中的评论" href="{ thread.url }#comments">{ message }</a></li></div><ds-waiting if="{ !!!ready }"></ds-waiting>', function (t) {
        function e(t) {
          0 === t.code && (s.comments = t.response, s.defaults = t.options, s.ready = !0, s.update())
        }
        var s = this,
          i = DUOSHUO.utils,
          o = "show-avatars show-time show-title avatar-size show-admin excerpt-length num-items channel-key";
        this.ready = !1, DUOSHUO.API.get("sites/listRecentPosts", i.formatQuery(o, t), e)
      }), riot.tag("ds-recent-visitors", '<div id="ds-recent-visitors" class="ds-avatar"><ds-avatar user="{ this.user }" each="{ user in users }" size="{ parent.opts.avatar_size || parent.defaults.avatar_size }"></ds-avatar></div><ds-waiting if="{ !!!ready }"></ds-waiting>', function (t) {
        function e(t) {
          0 === t.code && (s.defaults = t.options, s.users = t.response, s.ready = !0, s.update())
        }
        var s = this,
          i = DUOSHUO.utils,
          o = "show-time avatar-size num-items channel-key";
        this.ready = !1, DUOSHUO.API.get("sites/listVisitors", i.formatQuery(o, t), e)
      }), riot.tag("ds-thread-count", "", function (t) {
        function e(t) {
          if (t.response && t.response[a]) {
            var e = i.opts,
              n = "comments",
              r = t.response[a][n],
              d = _.extend(DUOSHUO._lang, t.options);
            s(o)[e.replace || e["data-replace"] ? "replaceWith" : "html"](d[n + "_" + (r ? r > 1 ? "multiple" : "one" : "zero")].replace("{num}", r))
          }
        }
        var s = $ds,
          i = this,
          o = this.root,
          n = (DUOSHUO.utils, {});
        n.__comboMode = t.combo || !0;
        var a = n.threads = t["thread-key"] || t["data-thread-key"],
          r = t["channel-key"] || t["data-channel-key"];
        r && (a = r + ":" + a), n.__comboMode && (n.queryKey = "threads"), DUOSHUO.API.get("threads/counts", n, e)
      }), riot.tag("ds-top-threads", '<div id="ds-top-threads"><li each="{ threads }"><a target="_blank" href="{ url }" title="{ title }">{ title }</a></li></div><ds-waiting if="{ !!!ready }"></ds-waiting>', function (t) {
        function e(t) {
          0 === t.code && (s.threads = t.response, s.ready = !0, s.update())
        }
        var s = this,
          i = DUOSHUO.utils,
          o = "range num-items channel-key";
        this.ready = !1, DUOSHUO.API.get("sites/listTopThreads", i.formatQuery(o, t), e)
      }), riot.tag("ds-share", '<div id="ds-share" class="{ \'flat\': opts[\'data-flat\'] }"><div id="ds-reset" class="ds-share-inline"><div class="ds-share-icons-{ size }"><ds-share-icons shareoptions="{ opts }" size="{ size }" flat="{ opts[\'data-flat\'] }" services="weibo,qzone,qqt,wechat" showtoggle="{ true }"></ds-share-icons></div><div class="ds-share-icons-more" show="{ showMore }"><div class="ds-share-icons"><div class="ds-share-icons-inner"><ds-share-icons shareoptions="{ opts }"></ds-share-icons></div><div class="ds-share-icons-footer">{ copyright }</div></div></div></div></div>', function (t) {
        this.on("update", function () {
          this.size = t["data-size"] || 16, this.copyright = t.copyright || "多说分享插件", "undefined" == typeof this.showMore && (this.showMore = !1)
        }), this.toggleMore = function () {
          this.showMore = !this.showMore, this.update()
        }.bind(this)
      }), riot.tag("ds-share-aside", '<div id="ds-share" class="ds-share-aside-{ position } { \'flat\': opts[\'data-flat\'] }"><div id="ds-reset" class="{ \'slide-to-left\': asideToLeft, \'slide-to-right\': asideToRight }"><div class="ds-share-aside-inner"><ds-share-icons flat="{ opts[\'data-flat\'] }" shareoptions="{ opts }"></ds-share-icons></div><div class="ds-share-aside-toggle" onclick="{ toggleAside }">分享到</div></div></div>', function (t) {
        function e(t) {
          var e = "left" === s.position ? "asideToRight" : "asideToLeft";
          s[e] = t || !s[e]
        }
        var s = this;
        this.on("update", function () {
          this.position = t["data-position"] || "left"
        }), this.toggleAside = function () {
          e(), this.update()
        }.bind(this)
      }), riot.tag("ds-share-icons", '<ul class="ds-share-icons-{ size }"><li if="{ opts.showtoggle }" onclick="{ parent.toggleMore }"><a class="ds-more" href="javascript:void(0);">{ parent.size != 32 ? \'分享到：\' : \'\' }</a></li><li each="{ s in services }"><a class="ds-{ s } { flat: parent.opts.flat }" href="javascript:void(0);" onclick="{ parent.share }" data-service="{ s }">{ parent.size != 32 ? parent.sourceName[s] : \'\' } </a></li></ul>', function (s) {
        var i = DUOSHUO.utils,
          o = i.dialog,
          n = ["weibo", "qzone", "sohu", "renren", "netease", "qqt", "kaixin", "douban", "qq", "meilishuo", "mogujie", "baidu", "taobao", "google", "wechat", "diandian", "huaban", "duitang", "youdao", "pengyou", "facebook", "twitter", "linkedin", "msn"];
        this.sourceName = DUOSHUO.constents.sourceName, this.on("update", function () {
          this.size = s.size || 16, this.services = s.services ? s.services.split(",") : n
        }), this.share = function (n) {
          var a = n.target.getAttribute("data-service"),
            r = s.shareoptions["data-url"];
          if (!r) return i.errors.handle("missing_data_url", {
            showAlert: !0
          });
          if ("wechat" === a) {
            var d = i.hostUrl() + "/api/qrcode/getImage.png",
              c = "?size=240&text=" + r,
              l = $ds("#dsDialogContent");
            return l && l.el || riot.mount(e.body, "ds-dialog"), void o.open("ds-dialog-qrcode", {
              qrcode_url: d + c,
              url: r,
              style: "width: 320px;"
            })
          }
          var u = i.hostUrl() + "/share-proxy/?" + _.param({
            service: a,
            thread_key: s.shareoptions["data-thread-key"],
            title: s.shareoptions["data-title"],
            images: s.shareoptions["data-images"],
            content: s.shareoptions["data-content"],
            url: r
          });
          t.open(u, "_blank")
        }.bind(this)
      }),
      function (t, e) {
        "use strict";
        var s = e.utils,
          i = s.errors.handle;
        e.mount(), _dom.ready(function () {
          if (!duoshuoQuery) {
            if (!s.checkDuoshuoQuery()) return i("missing_dsq");
            i("define_dsq")
          }
          e.mountClasses(), duoshuoQuery.ondomready && duoshuoQuery.ondomready()
        })
      }(t, t.DUOSHUO)
  }
}(window, document);