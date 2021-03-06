# jQuery.loadTemplate

jQuery Template is a jQuery plugin that makes using templates easy and quick. The plugin supports loading HTML files as templates, or taking a jQuery object as the template (usually using script tags to hold the template).

The plugin parses a template using data attributes to populate the data. Simply pass in a JavaScript object, and the plugin does the rest.

An example template is below:

    <script type="text/html" id="template">
        <div data-content="author"></div>
        <div data-content="date"></div>
        <img data-src="authorPicture" data-alt="author"/>
        <div data-content="post"></div>
    </script>

And to use this do the following:

    $("#template-container").loadTemplate($("#template"),
		{
            author: 'Joe Bloggs',
            date: '25th May 2013',
            authorPicture: 'Authors/JoeBloggs.jpg',
            post: 'This is the contents of my post'
        });

Similarly the content of the template could be held in a separate html file without the enclosing script tag, and used like the following:

    $("#template-container").loadTemplate("Templates/template.html",
		{
            author: 'Joe Bloggs',
            date: '25th May 2013',
            authorPicture: 'Authors/JoeBloggs.jpg',
            post: 'This is the contents of my post'
        });

It is also possible to define data formatters. These are assigned through the `$.addTemplateFormatter` method. This function either accepts a map of functions and the keys that they will be referenced by, or a single function with a single key as two separate parameters. Each formatter takes two values, the value being assigned to the content, and a template to use to define how this data is displayed. The data-format-template may be empty. Example usage of this is below:

    $.addTemplateFormatter("UpperCaseFormatter",
        function(value, template) {
            return value.toUpperCase();
        });

Alternatively with a map:

    $.addTemplateFormatter({
        UpperCaseFormatter : function(value, template) {
                return value.toUpperCase();
            },
        LowerCaseFormatter : function(value, template) {
                return value.toLowerCase();
            },
        SameCaseFormatter : function(value, template) {
                if(template == "upper") {
					return value.toUpperCase();
				} else {
					return value.toLowerCase();
				}
            }
    });

To call these templates, simply the following will work:

	<div data-content="post" data-template="SameCaseFormatter"
		data-template-format="upper"></div>

Formatters must be added before they are used else a template will not be able to access them. Formatters are used at the time of populating the data.