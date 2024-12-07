var app = angular.module('liveActionApp', []);

app.controller('MainController', ['$scope', function ($scope) {
    $scope.sampleText = new Array(9).fill('$');
}]);

app.directive('liveActionButton', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        scope: {
            minScrollDifference: '@'
        },
        link: function (scope, element, attrs) {
            const button = angular.element('<button class="live-action-button"><span class="arrow-icon">&#x2193;</span></button>');
            button.css('display', 'none');
            element.append(button);

            let minScrollDifference = parseInt(scope.minScrollDifference) || 50;

            function checkIfScrollable() {
                $timeout(function () {
                    let scrollableHeight = element[0].scrollHeight - element[0].clientHeight;
                    let isScrollable = scrollableHeight > minScrollDifference;
                    button.css('display', isScrollable ? 'block' : 'none');
                });
            }

            function checkIfScrolledToBottom() {

                let currentScrollPosition = element[0].scrollTop + element[0].clientHeight;
                let isAtBottom = currentScrollPosition >= element[0].scrollHeight - 1;
                button.css('display', isAtBottom ? 'none' : 'block');
            }

            function scrollToBottom() {
                element[0].scrollTo({ top: element[0].scrollHeight, behavior: 'smooth' });

                $timeout(checkIfScrolledToBottom, 500);
            }

            button.on('click', scrollToBottom);

            angular.element($window).on('resize', checkIfScrollable);

            element.on('scroll', checkIfScrolledToBottom);

            checkIfScrollable();

            scope.$on('$destroy', function () {
                button.off('click', scrollToBottom);
                angular.element($window).off('resize', checkIfScrollable);
                element.off('scroll', checkIfScrolledToBottom);
            });
        }
    };
}]);
