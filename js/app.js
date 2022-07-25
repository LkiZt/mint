(() => {
  "use strict";
  class t {
    constructor(t) {
      let e = {
        logging: !0,
        init: !0,
        attributeOpenButton: "data-popup",
        attributeCloseButton: "data-close",
        fixElementSelector: "[data-lp]",
        youtubeAttribute: "data-youtube",
        youtubePlaceAttribute: "data-youtube-place",
        setAutoplayYoutube: !0,
        classes: {
          popup: "popup",
          popupContent: "popup__content",
          popupActive: "popup_show",
          bodyActive: "popup-show",
        },
        focusCatch: !0,
        closeEsc: !0,
        bodyLock: !0,
        bodyLockDelay: 500,
        hashSettings: { location: !0, goHash: !0 },
        on: {
          beforeOpen: function () {},
          afterOpen: function () {},
          beforeClose: function () {},
          afterClose: function () {},
        },
      };
      (this.isOpen = !1),
        (this.targetOpen = { selector: !1, element: !1 }),
        (this.previousOpen = { selector: !1, element: !1 }),
        (this.lastClosed = { selector: !1, element: !1 }),
        (this._dataValue = !1),
        (this.hash = !1),
        (this._reopen = !1),
        (this._selectorOpen = !1),
        (this.lastFocusEl = !1),
        (this._focusEl = [
          "a[href]",
          'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
          "button:not([disabled]):not([aria-hidden])",
          "select:not([disabled]):not([aria-hidden])",
          "textarea:not([disabled]):not([aria-hidden])",
          "area[href]",
          "iframe",
          "object",
          "embed",
          "[contenteditable]",
          '[tabindex]:not([tabindex^="-"])',
        ]),
        (this.options = {
          ...e,
          ...t,
          classes: { ...e.classes, ...t?.classes },
          hashSettings: { ...e.hashSettings, ...t?.hashSettings },
          on: { ...e.on, ...t?.on },
        }),
        this.options.init && this.initPopups();
    }
    initPopups() {
      this.popupLogging("Проснулся"), this.eventsPopup();
    }
    eventsPopup() {
      document.addEventListener(
        "click",
        function (t) {
          const e = t.target.closest(`[${this.options.attributeOpenButton}]`);
          if (e)
            return (
              t.preventDefault(),
              (this._dataValue = e.getAttribute(
                this.options.attributeOpenButton
              )
                ? e.getAttribute(this.options.attributeOpenButton)
                : "error"),
              "error" !== this._dataValue
                ? (this.isOpen || (this.lastFocusEl = e),
                  (this.targetOpen.selector = `${this._dataValue}`),
                  (this._selectorOpen = !0),
                  void this.open())
                : void this.popupLogging(
                    `Ой ой, не заполнен атрибут у ${e.classList}`
                  )
            );
          return t.target.closest(`[${this.options.attributeCloseButton}]`) ||
            (!t.target.closest(`.${this.options.classes.popupContent}`) &&
              this.isOpen)
            ? (t.preventDefault(), void this.close())
            : void 0;
        }.bind(this)
      ),
        document.addEventListener(
          "keydown",
          function (t) {
            if (
              this.options.closeEsc &&
              27 == t.which &&
              "Escape" === t.code &&
              this.isOpen
            )
              return t.preventDefault(), void this.close();
            this.options.focusCatch &&
              9 == t.which &&
              this.isOpen &&
              this._focusCatch(t);
          }.bind(this)
        ),
        document.querySelector("form[data-ajax],form[data-dev]") &&
          document.addEventListener(
            "formSent",
            function (t) {
              const e = t.detail.form.dataset.popupMessage;
              e && this.open(e);
            }.bind(this)
          ),
        this.options.hashSettings.goHash &&
          (window.addEventListener(
            "hashchange",
            function () {
              window.location.hash
                ? this._openToHash()
                : this.close(this.targetOpen.selector);
            }.bind(this)
          ),
          window.addEventListener(
            "load",
            function () {
              window.location.hash && this._openToHash();
            }.bind(this)
          ));
    }
    open(t) {
      if (
        (t &&
          "string" == typeof t &&
          "" !== t.trim() &&
          ((this.targetOpen.selector = t), (this._selectorOpen = !0)),
        this.isOpen && ((this._reopen = !0), this.close()),
        this._selectorOpen ||
          (this.targetOpen.selector = this.lastClosed.selector),
        this._reopen || (this.previousActiveElement = document.activeElement),
        (this.targetOpen.element = document.querySelector(
          this.targetOpen.selector
        )),
        this.targetOpen.element)
      ) {
        if (
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
        ) {
          const t = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
              this.options.youtubeAttribute
            )}?rel=0&showinfo=0&autoplay=1`,
            e = document.createElement("iframe");
          e.setAttribute("allowfullscreen", "");
          const s = this.options.setAutoplayYoutube ? "autoplay;" : "";
          e.setAttribute("allow", `${s}; encrypted-media`),
            e.setAttribute("src", t),
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
              this.targetOpen.element
                .querySelector(`[${this.options.youtubePlaceAttribute}]`)
                .appendChild(e);
        }
        this.options.hashSettings.location &&
          (this._getHash(), this._setHash()),
          this.options.on.beforeOpen(this),
          this.targetOpen.element.classList.add(
            this.options.classes.popupActive
          ),
          document.body.classList.add(this.options.classes.bodyActive),
          this._reopen ? (this._reopen = !1) : i(),
          this.targetOpen.element.setAttribute("aria-hidden", "false"),
          (this.previousOpen.selector = this.targetOpen.selector),
          (this.previousOpen.element = this.targetOpen.element),
          (this._selectorOpen = !1),
          (this.isOpen = !0),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          document.dispatchEvent(
            new CustomEvent("afterPopupOpen", { detail: { popup: this } })
          ),
          this.popupLogging("Открыл попап");
      } else
        this.popupLogging(
          "Ой ой, такого попапа нет. Проверьте корректность ввода. "
        );
    }
    close(t) {
      t &&
        "string" == typeof t &&
        "" !== t.trim() &&
        (this.previousOpen.selector = t),
        this.isOpen &&
          o &&
          (this.options.on.beforeClose(this),
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute) &&
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
            (this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ).innerHTML = ""),
          this.previousOpen.element.classList.remove(
            this.options.classes.popupActive
          ),
          this.previousOpen.element.setAttribute("aria-hidden", "true"),
          this._reopen ||
            (document.body.classList.remove(this.options.classes.bodyActive),
            i(),
            (this.isOpen = !1)),
          this._removeHash(),
          this._selectorOpen &&
            ((this.lastClosed.selector = this.previousOpen.selector),
            (this.lastClosed.element = this.previousOpen.element)),
          this.options.on.afterClose(this),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          this.popupLogging("Закрыл попап"));
    }
    _getHash() {
      this.options.hashSettings.location &&
        (this.hash = this.targetOpen.selector.includes("#")
          ? this.targetOpen.selector
          : this.targetOpen.selector.replace(".", "#"));
    }
    _openToHash() {
      let t = document.querySelector(
        `.${window.location.hash.replace("#", "")}`
      )
        ? `.${window.location.hash.replace("#", "")}`
        : document.querySelector(`${window.location.hash}`)
        ? `${window.location.hash}`
        : null;
      document.querySelector(`[${this.options.attributeOpenButton}="${t}"]`) &&
        t &&
        this.open(t);
    }
    _setHash() {
      history.pushState("", "", this.hash);
    }
    _removeHash() {
      history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(t) {
      const e = this.targetOpen.element.querySelectorAll(this._focusEl),
        s = Array.prototype.slice.call(e),
        o = s.indexOf(document.activeElement);
      t.shiftKey && 0 === o && (s[s.length - 1].focus(), t.preventDefault()),
        t.shiftKey || o !== s.length - 1 || (s[0].focus(), t.preventDefault());
    }
    _focusTrap() {
      const t = this.previousOpen.element.querySelectorAll(this._focusEl);
      !this.isOpen && this.lastFocusEl
        ? this.lastFocusEl.focus()
        : t[0].focus();
    }
    popupLogging(t) {
      this.options.logging &&
        (function (t) {
          setTimeout(() => {
            window.FLS && console.log(t);
          }, 0);
        })(`[Попапос]: ${t}`);
    }
  }
  let e = (t, e = 500, s = 0) => {
      t.classList.contains("_slide") ||
        (t.classList.add("_slide"),
        (t.style.transitionProperty = "height, margin, padding"),
        (t.style.transitionDuration = e + "ms"),
        (t.style.height = `${t.offsetHeight}px`),
        t.offsetHeight,
        (t.style.overflow = "hidden"),
        (t.style.height = s ? `${s}px` : "0px"),
        (t.style.paddingTop = 0),
        (t.style.paddingBottom = 0),
        (t.style.marginTop = 0),
        (t.style.marginBottom = 0),
        window.setTimeout(() => {
          (t.hidden = !s),
            !s && t.style.removeProperty("height"),
            t.style.removeProperty("padding-top"),
            t.style.removeProperty("padding-bottom"),
            t.style.removeProperty("margin-top"),
            t.style.removeProperty("margin-bottom"),
            !s && t.style.removeProperty("overflow"),
            t.style.removeProperty("transition-duration"),
            t.style.removeProperty("transition-property"),
            t.classList.remove("_slide");
        }, e));
    },
    s = (t, e = 500, s = 0) => {
      if (!t.classList.contains("_slide")) {
        t.classList.add("_slide"),
          (t.hidden = !t.hidden && null),
          s && t.style.removeProperty("height");
        let o = t.offsetHeight;
        (t.style.overflow = "hidden"),
          (t.style.height = s ? `${s}px` : "0px"),
          (t.style.paddingTop = 0),
          (t.style.paddingBottom = 0),
          (t.style.marginTop = 0),
          (t.style.marginBottom = 0),
          t.offsetHeight,
          (t.style.transitionProperty = "height, margin, padding"),
          (t.style.transitionDuration = e + "ms"),
          (t.style.height = o + "px"),
          t.style.removeProperty("padding-top"),
          t.style.removeProperty("padding-bottom"),
          t.style.removeProperty("margin-top"),
          t.style.removeProperty("margin-bottom"),
          window.setTimeout(() => {
            t.style.removeProperty("height"),
              t.style.removeProperty("overflow"),
              t.style.removeProperty("transition-duration"),
              t.style.removeProperty("transition-property"),
              t.classList.remove("_slide");
          }, e);
      }
    },
    o = !0,
    i = (t = 500) => {
      document.documentElement.classList.contains("lock") ? n(t) : r(t);
    },
    n = (t = 500) => {
      let e = document.querySelector("body");
      if (o) {
        let s = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
          for (let t = 0; t < s.length; t++) {
            s[t].style.paddingRight = "0px";
          }
          (e.style.paddingRight = "0px"),
            document.documentElement.classList.remove("lock");
        }, t),
          (o = !1),
          setTimeout(function () {
            o = !0;
          }, t);
      }
    },
    r = (t = 500) => {
      let e = document.querySelector("body");
      if (o) {
        let s = document.querySelectorAll("[data-lp]");
        for (let t = 0; t < s.length; t++) {
          s[t].style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
        }
        (e.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px"),
          document.documentElement.classList.add("lock"),
          (o = !1),
          setTimeout(function () {
            o = !0;
          }, t);
      }
    };
  function l(t, e) {
    const s = Array.from(t).filter(function (t, s, o) {
      if (t.dataset[e]) return t.dataset[e].split(",")[0];
    });
    if (s.length) {
      const t = [];
      s.forEach((s) => {
        const o = {},
          i = s.dataset[e].split(",");
        (o.value = i[0]),
          (o.type = i[1] ? i[1].trim() : "max"),
          (o.item = s),
          t.push(o);
      });
      let o = t.map(function (t) {
        return (
          "(" + t.type + "-width: " + t.value + "px)," + t.value + "," + t.type
        );
      });
      o = (function (t) {
        return t.filter(function (t, e, s) {
          return s.indexOf(t) === e;
        });
      })(o);
      const i = [];
      if (o.length)
        return (
          o.forEach((e) => {
            const s = e.split(","),
              o = s[1],
              n = s[2],
              r = window.matchMedia(s[0]),
              l = t.filter(function (t) {
                if (t.value === o && t.type === n) return !0;
              });
            i.push({ itemsArray: l, matchMedia: r });
          }),
          i
        );
    }
  }
  let a = !1;
  setTimeout(() => {
    if (a) {
      let t = new Event("windowScroll");
      window.addEventListener("scroll", function (e) {
        document.dispatchEvent(t);
      });
    }
  }, 0),
    (window.FLS = !0),
    (function (t) {
      let e = new Image();
      (e.onload = e.onerror =
        function () {
          t(2 == e.height);
        }),
        (e.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
    })(function (t) {
      let e = !0 === t ? "webp" : "no-webp";
      document.documentElement.classList.add(e);
    }),
    (function () {
      const t = document.querySelectorAll("[data-spollers]");
      if (t.length > 0) {
        const o = Array.from(t).filter(function (t, e, s) {
          return !t.dataset.spollers.split(",")[0];
        });
        o.length && n(o);
        let i = l(t, "spollers");
        function n(t, e = !1) {
          t.forEach((t) => {
            (t = e ? t.item : t),
              e.matches || !e
                ? (t.classList.add("_spoller-init"),
                  r(t),
                  t.addEventListener("click", a))
                : (t.classList.remove("_spoller-init"),
                  r(t, !1),
                  t.removeEventListener("click", a));
          });
        }
        function r(t, e = !0) {
          const s = t.querySelectorAll("[data-spoller]");
          s.length > 0 &&
            s.forEach((t) => {
              e
                ? (t.removeAttribute("tabindex"),
                  t.classList.contains("_spoller-active") ||
                    (t.nextElementSibling.hidden = !0))
                : (t.setAttribute("tabindex", "-1"),
                  (t.nextElementSibling.hidden = !1));
            });
        }
        function a(t) {
          const o = t.target;
          if (o.closest("[data-spoller]")) {
            const i = o.closest("[data-spoller]"),
              n = i.closest("[data-spollers]"),
              r = !!n.hasAttribute("data-one-spoller");
            n.querySelectorAll("._slide").length ||
              (r && !i.classList.contains("_spoller-active") && p(n),
              i.classList.toggle("_spoller-active"),
              ((t, o = 500) => {
                t.hidden ? s(t, o) : e(t, o);
              })(i.nextElementSibling, 500)),
              t.preventDefault();
          }
        }
        function p(t) {
          const s = t.querySelector("[data-spoller]._spoller-active");
          s &&
            (s.classList.remove("_spoller-active"),
            e(s.nextElementSibling, 500));
        }
        i &&
          i.length &&
          i.forEach((t) => {
            t.matchMedia.addEventListener("change", function () {
              n(t.itemsArray, t.matchMedia);
            }),
              n(t.itemsArray, t.matchMedia);
          });
      }
    })(),
    new t({});
})();
