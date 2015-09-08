var authService = angular.module('authService', []);
authService.factory("Auth", ($http, $q, AuthToken) =>
    new App.Services.AuthFactory($http, $q, AuthToken)
);
authService.factory("AuthToken", ($window) =>
    new App.Services.AuthTokenFactory($window)
);
authService.factory("AuthInterceptor", ($q, $location, AuthToken) =>
    new App.Services.AuthInterceptorFactory($q, $location, AuthToken)
);
    
       


    module App.Services {
      export class AuthFactory {
            constructor($http: any, $q: any, AuthToken: any) {
                this.$http = $http;
                this.$q = $q;
                this.AuthToken = AuthToken;
            }

            $http;
            $q;
            AuthToken;

            public login(username: string, password: string): any {
                return this.$http.post('/api/login', {
                    username: username,
                    password: password
                })
                    .success((data) => {
                        this.AuthToken.setToken(data.token);
                        return data;
                    });
            }

            public logout(): void {
                this.AuthToken.setToken();
            }
            public isLoggedIn(): boolean {
                if (this.AuthToken.getToken()) {
                    return true;
                } else {
                    return false;
                }
            }

            public getUser() {
                if (this.AuthToken.getToken())
                    return this.$http.get('/api/me');
                else
                    return this.$q.reject({ message: "User has no Token" });
            }




        }

      export class AuthTokenFactory {
            constructor($window: any) { this.$window = $window; }

            $window;

            public getToken() {
                return this.$window.localStorage.getItem('token');
            }
            public setToken(token: string) {
                if (token)
                    this.$window.localStorage.setItem('token', token);
                else
                    this.$window.localStorage.removeItem('token');
            }

        }

      export class AuthInterceptorFactory {
            constructor($q: any, $location: any, AuthToken: any) {
                this.$q = $q;
                this.$location = $location;
                this.AuthToken = AuthToken;
            }

            $q;
            $location;
            AuthToken;

            public request(config): string {
                var token = this.AuthToken.getToken();
                if (token) {
                    config.headers['x-access-token'] = token;
                }
                return config;
            }

            public responseError(response) {
                if (response.status == 403)
                    this.$location.path('/login');
                return this.$q.reject(response);

            }


        }

    }

