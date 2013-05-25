(function ($) {
    var templates = {};

    function loadTemplate(template, data, callback) {
        var $that = this
        if (!(template instanceof jQuery) && templates[template]) {
            $templateContainer = templates[template];
            prepareTemplate($templateContainer, data);
        } else if (!(template instanceof jQuery)) {
            var $templateContainer = $("<div/>");
            $templateContainer.load(template, function () {
                templates[template] = $templateContainer;
                prepareTemplate($templateContainer, data);
            });
        } else {
            var $templateContainer = $("<div/>");
            if (template.is("script")) {
                template = $.parseHTML(template.html().trim());
            }
            $templateContainer.html(template);
            prepareTemplate($templateContainer, data);
        }
        return this;

        function prepareTemplate(template, data) {
            bindData(template, data);
            $that.each(function () {
                $(this).html(template.html());
            });
            if (callback && typeof callback === "function") {
                callback();
            }
        }

        function bindData(template, data) {
            var data = data || {};

            processElements("data-content", data, function ($elem, value) {
                var formatter = $elem.attr("data-format");
                if (formatter && typeof formatters[formatter] === "function") {
                    var formatTemplate = $elem.attr("data-format-template");
                    $elem.html(Formatters[formatter](value), formatTemplate);
                }
                else {
                    $elem.html(value);
                }
            });

            processElements("data-src", data, function ($elem, value) {
                $elem.attr("src", value);
            }, function ($elem) {
                $elem.remove();
            });

            processElements("data-alt", data, function ($elem, value) {
                $elem.attr("alt", value);
            });

            processElements("data-link", data, function ($elem, value) {
                var $linkElem = $("<a/>");
                $linkElem.attr("href", value);
                $linkElem.html($elem.html());
                $elem.html($linkElem);
            });

            processElements("data-link-wrap", data, function ($elem, value) {
                var $linkElem = $("<a/>");
                $linkElem.attr("href", value);
                $elem.wrap($linkElem);
            });

            function processElements(attribute, data, dataBindFunction, noDataFunction) {
                $("[" + attribute + "]", template).each(function (key, val) {
                    var param = $(val).attr(attribute);
                    $(val).removeAttr(attribute);

                    if (data[param] && dataBindFunction) {
                        dataBindFunction($(val), data[param]);
                    } else if (noDataFunction) {
                        noDataFunction($(val));
                    }
                });
                return;
            }
        }

        var formatters = {
            getFormattedDateString: function (dateString, template) {
                template = template || "MMMM yyyy";
                var date = new Date(dateString);
                return date.toLocaleDateString(template);
            }
        };
    };

    $.fn.loadTemplate = loadTemplate;

})(jQuery);