var dataJSONconsoleManager = function () {
    this.listGroupConsole = $('.list-group.list-group-item-console');
    this.listGroupItemConsoleLogTemplate = $('.list-group-item-log-template', this.listGroupConsole).detach().removeClass('d-none list-group-item-log-template');
    this.iConsoleUpdating = $('i.fa-console-updating');
};

dataJSONconsoleManager.prototype.prependNewLog = function (message, additionalClasses) {
    var newListGroupItemLog = this.listGroupItemConsoleLogTemplate.clone(true);
    $('span.list-group-item-log-message', newListGroupItemLog).html(message);
    $('span.list-group-item-log-date', newListGroupItemLog).text(new moment().format(standardTimeFormat));
    this.listGroupConsole.prepend(newListGroupItemLog.addClass(additionalClasses));
    return newListGroupItemLog;
};

dataJSONconsoleManager.prototype.empty = function () {
    this.listGroupConsole.empty();
    return this;
};

dataJSONconsoleManager.prototype.fadeInUpdating = function () {
    this.iConsoleUpdating.fadeIn(100);
    return this;
};

dataJSONconsoleManager.prototype.fadeOutUpdating = function () {
    this.iConsoleUpdating.fadeOut(100);
    return this;
};