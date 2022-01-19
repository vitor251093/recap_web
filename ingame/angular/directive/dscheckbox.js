app.directive("dscheckbox", function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            'ngModel': '='
        },
        controller: ['$scope', function($scope) {
            $scope.id = "checkbox-" + Math.floor(Math.random() * 1000000000);
            $scope.toggle = function() {
                $scope.ngModel = !$scope.ngModel;
            };
        }],
        template :  "<span class=\"input-checkbox-container\">" +
                    "    <input type=\"checkbox\" id=\"{{id}}\" name=\"{{id}}\" ng-model=\"ngModel\" />" +
                    "    <span class=\"checkmark\" ng-mouseup=\"toggle()\"></span>" +
                    "    <label for=\"{{id}}\" ng-transclude></label>" +
                    "</span>"
    };
});