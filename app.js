var app = angular.module('liveActionApp', []);

app.directive('liveActionButton', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            const button = angular.element('<button class="live-action-button"><span class="arrow-icon">&#x2193;</span></button>');
            button.css('display', 'none');
            element.append(button);

            function checkIfScrollable() {
                $timeout(function () {
                    var isScrollable = element[0].scrollHeight > element[0].clientHeight;
                    button.css('display', isScrollable ? 'block' : 'none');
                });
            }

            function scrollToBottom() {
                element[0].scrollTo({ top: element[0].scrollHeight, behavior: 'smooth' });
            }

            button.on('click', scrollToBottom);

            angular.element($window).on('resize', checkIfScrollable);

            checkIfScrollable();

            scope.$on('$destroy', function () {
                button.off('click', scrollToBottom);
                angular.element($window).off('resize', checkIfScrollable);
            });
        }
    };
}]);

app.controller('MainController', ['$scope', function ($scope) {
    $scope.sampleText = new Array(100).fill('This is some sample content to test scrolling.');
}]);
