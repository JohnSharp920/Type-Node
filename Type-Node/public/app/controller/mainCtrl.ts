
//export class MainController {
//    constructor(scope: any, location: any, Auth: any) {
//        this.scope = scope;
//        this.location = location;
//        this.Auth = Auth;
//    }

//    scope: any;
//    location: any;
//    Auth: any;



//    public doLogin(): void {
        
//    }
//}

var mainCtrl = angular.module('mainCtrl', []);

mainCtrl.controller("MainController", ($rootScope, $location, Auth) =>
    new App.Controllers.MainController( $rootScope, $location, Auth));


module App.Controllers {

    export interface IMainController {
        myNumber:number;
        doLogin: () => void;
        doLogout: () => void;
    }

    export class MainController implements IMainController {

        myNumber: number = 10;
        $rootScope: any;
        $location: any;
        Auth: any;
        loggedIn: boolean;
        user: string;
        processing: any;
        error: any;
        loginData: any;
        static $inject = ['$rootscope'];
        constructor($rootScope: any, $location: any, Auth: any) {
            $rootScope.vm = this;
            this.loggedIn = Auth.isLoggedIn();
            $rootScope.$on('$routeChangeStart', () => {
                this.loggedIn = Auth.isLoggedIn();
                Auth.getUser().then((data) => { this.user = data.data });
            });
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.Auth = Auth;
        }
        
        public doLogin() {
            console.log("success");
            this.processing = true;
            this.error = '';
            this.Auth.login(this.loginData.username, this.loginData.password)
                .success( (data) => {
                    this.processing = false;
                    this.Auth.getUser()
                        .then((data): void => {
                            this.user = data.data;
                        });
                    if (data.success)
                        this.$location.path('/');
                    else
                        this.error = data.message;
                });
        }

        public doLogout() {
            this.Auth.logout();
            this.$location.path('/logout');

        }

    }


    }

