$.fn.tagger = function(data, options) {
    var defaultOptions = {
        tagTemplate: '<div class="tagger-tag closed">' +
                '<div class="tag">' + 
                    '<a class="expand" href="#">' +
                        '<div class="text">Learn more</div>' +
                        '<div class="shown plus-button">+</div>' + 
                        '<div class="hidden plus-button">-</div>' + 
                    '</a>' +
                '</div>' +
                '<div class="hidden info">' + 
                    '<div class="title"><%= title %></div>' +
                    '<div class="text"><%= text %></div>' +
                    '<div class="link">' + 
                        '<a href="<%= targetUrl %>">' +
                            'GO TO THE PRODUCT' + 
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        expandOn: 'click'
    };
    options = $.extend(defaultOptions, options || {});

    this.each(function() {
        var $parent = $(this).parent(),
            offset = $(this).offset();

        _.each(data, function(item) {
            var $tag = $(_.template(options.tagTemplate, item));
            $tag.css('position', 'absolute');
            $tag.offset({
                left: item.x,
                top: item.y
            });
            $parent.append($tag);

            if (options.expandOn == 'click') {
                $tag.find('.expand').click(function(event) {
                    event.preventDefault();
                    $tag.find('.shown').toggle();
                    $tag.find('.hidden').toggle();
                    return false;
                }); 
            } else {
                $tag.hover(function(e) {
                    $tag.find('.shown').hide();
                    $tag.find('.hidden').show();
                }, function() {
                    $tag.find('.shown').show();
                    $tag.find('.hidden').hide();
                });
            }
        });
    });
};
