(function MendeleyBookmarklet() {
    if (!window.mendeleybookmarklet) window.mendeleybookmarklet = {};
    var iframeZIndex = 2147483640;
    var body, iframe, loadingDiv, closeButton, closeButtonDiv, iframeLoadCounter;
    var partnerSiteRegexes = ["://([^./]*www.)?sciencedirect.com[^/]*/"];
    var iframeCss = {
        "position": "fixed",
        "z-index": iframeZIndex,
        "visibility": "hidden",
        "-moz-box-sizing": "border-box",
        "box-sizing": "border-box",
        "padding": "15px",
        "border": "0",
        "background": "transparent",
        "height": "100%",
        "width": "350px",
        "top": "0",
        "right": "0",
        "overflow": "hidden"
    };
    var loadingDivCss = {
        "position": "fixed",
        "z-index": iframeZIndex + 1,
        "top": "15px",
        "right": "15px",
        "border": " 5px solid #ADADAD",
        "border-radius": "5px",
        "margin": " 0",
        "padding": " 0",
        "width": "320px",
        "background": " #f7f7f7",
        "color": "#666",
        "-moz-box-sizing": " border-box",
        "box-sizing": " border-box"
    };
    var loadingTitleCss = {
        "padding": " 8px",
        "text-align": "left",
        "font-family": "Arial, sans-serif",
        "font-size": "14px",
        "line-height": "24px",
        "padding-left": "50px",
        "background-image": " -webkit-linear-gradient(bottom, rgb(226,226,226) 0%, rgb(255,255,255) 100%)"
    };
    var loadingContentCss = {
        "font-size": "14px",
        "text-align": "center"
    };
    var loadingSpinnerCss = {
        "margin": "30px 0 10px -5px"
    };
    var mendeleyBadgeCss = {
        "position": "absolute",
        "top": "0",
        "left": "10px;"
    };
    var closeButtonDivCss = {
        "position": "fixed",
        "z-index": iframeZIndex + 2
    };
    var closeButtonCss = {
        "position": "fixed",
        "top": "7px",
        "right": "320px",
        "cursor": "pointer"
    };
    var closeButtonCssIE = {
        "position": "fixed",
        "background": "#222",
        "color": "#fff",
        "border": " 2px solid #fff",
        "height": "20px",
        "line-height": "22px !important",
        "width": "21px",
        "top": "7px",
        "right": "320px",
        "text-align": "center",
        "font-size": "16px !important",
        "font-weight": "bold !important",
        "text-decoration": "none !important",
        "font-family": "Arial, sans-serif !important"
    };

    function applyCss(el, css) {
        var s = "";
        for (var p in css) s += p + ":" + css[p] + ";";
        el.style.cssText = el.style.cssText + s;
    }

    function handleIframeLoad() {
        if (++iframeLoadCounter == 2) {
            loadingDiv.style.visibility = "hidden";
            iframe.style.visibility = "visible";
            setLoadingFlag(false);
        }
    }

    function createIframe() {
        iframe = document.createElement("IFRAME");
        iframe.src = "about:blank";
        iframe.allowTransparency = true;
        iframe.height = "100%";
        iframe.width = "350px";
        iframe.frameBorder = 0;
        applyCss(iframe, iframeCss);
        body.appendChild(iframe);
        if (iframe.attachEvent) iframe.attachEvent("onload", handleIframeLoad);
        else iframe.onload = handleIframeLoad;
    }

    function createLoadingDiv() {
        loadingDiv = document.createElement("DIV");
        applyCss(loadingDiv, loadingDivCss);
        var mendeleyBadge = document.createElement("IMG");
        applyCss(mendeleyBadge, mendeleyBadgeCss);
        mendeleyBadge.src = "data:icon-16.png";
        var loadingTitle = document.createElement("DIV");
        applyCss(loadingTitle, loadingTitleCss);
        loadingTitle.innerHTML = "Save to Mendeley";
        var loadingContent = document.createElement("DIV");
        applyCss(loadingContent, loadingContentCss);
        var loadingSpinner = document.createElement("IMG");
        applyCss(loadingSpinner, loadingSpinnerCss);
        loadingSpinner.src = "data:icon-16.png";
        loadingContent.appendChild(loadingSpinner);
        var loadingMessage = document.createElement("P");
        loadingMessage.innerHTML = "Loading...";
        loadingContent.appendChild(loadingMessage);
        body.appendChild(loadingDiv);
        loadingDiv.appendChild(mendeleyBadge);
        loadingDiv.appendChild(loadingTitle);
        loadingDiv.appendChild(loadingContent);
    }

    function createCloseButtonDiv() {
        closeButtonDiv = document.createElement("DIV");
        applyCss(closeButtonDiv, closeButtonDivCss);
        if (navigator.appVersion.indexOf("MSIE 7.") != -1) {
            closeButton = document.createElement("A");
            applyCss(closeButton, closeButtonCssIE);
            closeButton.href = "#";
            closeButton.innerHTML = "&#215;";
        } else {
            closeButton = document.createElement("IMG");
            applyCss(closeButton, closeButtonCss);
            closeButton.src = "data:icon-16.png";
        }
        closeButton.id =
            "mendeley-bookmarklet-close";
        closeButton.title = "Close the importer";
        closeButton.onclick = function() {
            cleanUpOnShutdown();
            return false;
        };
        body.appendChild(closeButtonDiv);
        closeButtonDiv.appendChild(closeButton);
    }

    function submitIframeForm(hroot) {
        var iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write("" + "<html>" + "<head></head>" + "<body onload=\"document.getElementsByTagName('FORM')[0].submit();\">" + getForm(hroot) + "</body>" + "</html>");
        iframeDoc.close();
    }

    function saveInjectedElements() {
        window.mendeleybookmarklet.elements = {
            iframe: iframe,
            loadingDiv: loadingDiv,
            closeButtonDiv: closeButtonDiv
        };
    }

    function getInjectedElements() {
        return window.mendeleybookmarklet.elements;
    }

    function cleanUpOnInitUI() {
        iframeLoadCounter = 0;
        removeElements(getInjectedElements());
        window.mendeleybookmarklet.elements = undefined;
    }

    function cleanUpOnShutdown() {
        removeElements(getInjectedElements());
        window.mendeleybookmarklet = undefined;
    }

    function removeElements(elements) {
        if (elements)
            for (var key in elements) {
                var element = elements[key];
                if (element) element.parentNode.removeChild(element);
            }
    }

    function setLoadingFlag(loading) {
        window.mendeleybookmarklet.loading = loading ? true : undefined;
    }

    function getLoadingFlag() {
        return window.mendeleybookmarklet.loading;
    }

    function removeScriptTag() {
        var scriptNode = document.getElementsByTagName("body")[0].lastChild;
        var src = scriptNode.getAttribute("src");
        try {
            scriptNode.parentNode.removeChild(scriptNode);
        } catch (e) {}
        return src;
    }

    function shouldSendCookies() {
        var url = document.location;
        for (var i = 0; i < partnerSiteRegexes.length; i++) {
            var regex = new RegExp(partnerSiteRegexes[i]);
            if (regex.test(url)) return true;
        }
        return false;
    }

    function getForm(hroot) {
        var div = document.createElement("DIV"),
            form = document.createElement("FORM"),
            endpointUrl = hroot + "/import/";
        data = {
            version: 1.1
        };
        if (typeof MendeleyImporterApi !== "undefined") {
            var isBookmarklet = !MendeleyImporterApi.getOpenedWithApi();
            var dataCallback = MendeleyImporterApi.getDataCallback();
            var identityCallback = MendeleyImporterApi.getUserIdentityCallback();
            var hostId = MendeleyImporterApi.getHostId();
            if (hostId && typeof hostId === "string") data.hostId =
                hostId;
            if (dataCallback && typeof dataCallback === "function") data.documents = dataCallback(isBookmarklet);
            if (identityCallback && typeof identityCallback === "function") data.identity = identityCallback(isBookmarklet);
            MendeleyImporterApi.setOpenedWithApi(false);
        } else {
            endpointUrl += "html/";
            data.html = "<html>" + document.documentElement.innerHTML + "</html>";
            data.url = window.location.href;
            data.cookies = shouldSendCookies() ? document.cookie : false;
        }
        appendSerialized(form, data);
        form.setAttribute("ACTION", endpointUrl);
        form.setAttribute("METHOD",
            "POST");
        form.setAttribute("ACCEPT-CHARSET", "UTF-8");
        div.appendChild(form);
        return div.innerHTML;
    }

    function appendSerialized(form, data, path) {
        var prop, item, input;
        for (prop in data) {
            if (!data.hasOwnProperty(prop)) continue;
            item = data[prop];
            if (typeof item === "string" || typeof item === "number") {
                input = document.createElement("INPUT");
                input.setAttribute("TYPE", "hidden");
                input.setAttribute("NAME", path ? path + "[" + prop + "]" : prop);
                input.setAttribute("VALUE", data[prop]);
                form.appendChild(input);
            } else if (typeof item === "object") appendSerialized(form,
                item, path ? path + "[" + prop + "]" : prop);
        }
    }

    function initUI(hroot) {
        if (getLoadingFlag()) {
            alert("Please wait while the importer is loading");
            return;
        }
        cleanUpOnInitUI();
        setLoadingFlag(true);
        body = document.getElementsByTagName("BODY")[0];
        createLoadingDiv();
        createCloseButtonDiv();
        createIframe();
        saveInjectedElements();
        submitIframeForm(hroot);
    }

    function run() {
        var source = removeScriptTag();
        var mendeleyHroot = source.match(/^https?:\/\/[^/]+/);
        initUI(mendeleyHroot);
    }
    try {
        run();
    } catch (e) {}
}());
