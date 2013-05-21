function Tag($img, index, x, y) {
    var imgOffset = $img.offset(),
        tagTemplate = $('#tag-template').text();

    this.$el = $(_.template(tagTemplate, {text: index}));
    this.$el.offset({
        left: x,
        top: y
    });

    this.x = x;
    this.y = y;
    this.index = index;

    this.title = '';
    this.text = '';
    this.targetUrl = '';
}

function TagEditView(tag) {
    var template = $('#tag-edit-template').text(),
        self = this;

    this.tag = tag;

    this.$el = $(_.template(template, {index: tag.index}));

    this.$el.find('input[name="title"]').on('change', function () {
        self.tag.title = $(this).val();
    });

    this.$el.find('textarea[name="text"]').on('change', function () {
        self.tag.text = $(this).val();
    });

    this.$el.find('input[name="targetUrl"]').on('change', function () {
        self.tag.targetUrl = $(this).val();
    });

    this.$el.find('.remove').on('click', function (e) {
        e.preventDefault();
        self.$el.remove();
        self.tag.$el.remove();
        $(self).trigger('remove', {index: tag.index});
        return false;
    });
}

/*
Tag.prototype.text = function() {
    if (arguments.length == 0) {
        return this.text;
    } else {
        this.text = arguments[0];
    }
};

Tag.prototype.targetUrl = function() {
    if (arguments.length == 0) {
        return this.targetUrl;
    } else {
        this.text = arguments[0];
    }
};
*/

$(document).ready(function() {
    var imageTemplate = $('#image-template').text(),
        $imageArea = $('#image-area'),
        $tagEditArea = $('#tag-edit-forms'),
        $previewArea = $('#preview-area'),
        outputTemplate = $('#output-template').text(),
        $outputTextarea = $('#output'),
        index = 1,
        tags = [];

    function placeTag($img, x, y) {
        var tag = new Tag($img, index, x, y),
            tagEditView = new TagEditView(tag);
        tags.push(tag);
        $imageArea.append(tag.$el);
        $tagEditArea.append(tagEditView.$el);
        $(tagEditView).on('remove', function(event, data) {
            var toRemove = _.find(tags, function(item) {
                return item.index == data.index;
            });
            tags.splice(_.indexOf(tags, toRemove), 1);
        });
        index++;
    }

    function reset() {
        $imageArea.html('');
        tags = [];
    }

    function setUrl(url) {
        var $imageEl = $(_.template(imageTemplate, {
                url: url
            }));
        
        $imageArea.append($imageEl);
        $imageEl.on('click', function(e) {
            var x = (e.offsetX || e.clientX - $(e.target).offset().left),
                y = (e.offsetY || e.clientY - $(e.target).offset().top);
            placeTag($(this), x, y);
        });
    }

    function generateOutput() {
        var output = _.template(outputTemplate, {
            imgId: 'tagged-img-' + Math.floor(Math.random()*1000),
            url: $('form#image-source input').val(),
            data: JSON.stringify(mapData())
        }).replace('**', '');

        $outputTextarea.val(output);
    }

    function mapData() {
        return _.map(tags, function(tag) {
            return {
                x: tag.x,
                y: tag.y,
                title: tag.title,
                text: tag.text,
                targetUrl: tag.targetUrl
            };
        });
    }

    $('form#image-source').submit(function() {
        var url = $(this).find('input').val();
        reset();
        setUrl(url);
        return false;
    });

    $('#preview-button').click(function() {
        var $img = $imageArea.find('img').clone(),
            data = mapData();
        $previewArea.html('');
        $previewArea.append($img);
        $img.tagger(data);
        generateOutput();
    });
});


