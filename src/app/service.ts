import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs, RequestOptions, RequestMethod, URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Adal4Service, Adal4HTTPService } from 'adal-angular4';

@Injectable()
export class SecureService {
  static factory(http: Http, service: Adal4Service) {
    return new SecureService(http, service);
  }
  constructor(
    private http: Http,
    private service: Adal4Service
  ) { }

  get<T>(url: string, data?: any, options?: RequestOptionsArgs) {
    let options1 = this.getRequestOption(RequestMethod.Get, data);
    options1 = Object.assign(options1, options);
    return this.sendRequest(url, options1);
  }

  private getRequestOption(method: any, data?: any) {
    let urlParams = new URLSearchParams();
    for (let key in data) {
      urlParams.set(key, data[key]);
    }
    if (method === RequestMethod.Get) {
      return new RequestOptions({ method: method, search: urlParams });
    }
    else {
      return new RequestOptions({ method: method, body: JSON.stringify(data) });
    }
  }

  private sendRequest(url: string, options: RequestOptionsArgs) {
    // make a copy
    let options1 = new RequestOptions();
    options1.method = options.method;
    options1 = options1.merge(options);

    const resource = this.service.GetResourceForEndpoint(url);
    let authenticatedCall: Observable<any>;
    if (resource) {
      if (this.service.userInfo.authenticated) {
        authenticatedCall = this.service.acquireToken(resource)
          .flatMap((token: string) => {
            // tslint:disable-next-line:no-console
            console.log(url, token);
            if (options1.headers == null) {
              options1.headers = new Headers();
            }
            if (!options1.headers.has('Content-Type')) {
              options1.headers.append('Content-Type', 'application/json');
            }
            options1.headers.append('Authorization', 'Bearer ' + token);
            return this.http.request(url, options1).map(response => {
              var apiRespose = response.json();
              var result = this.handleAPIResponse(apiRespose, url);
              return result;
            },
            ).catch((error: any) => {
              return this.handleError(error.status, url);
            });
          });
      }
      else {
        // tslint:disable-next-line:no-console
        console.log(this.service.userInfo);
        authenticatedCall = Observable.throw(new Error('User Not Authenticated.'));
      }
    }
    else {
      authenticatedCall = this.http.request(url, options).map(response => {
        var apiRespose = response.json();
        var result = this.handleAPIResponse(apiRespose, url);
        return result;
      },
      ).catch((error: any) => {
        return this.handleError(error.status, url);
      });
    }

    return authenticatedCall;
  }

  /**
   *
   *
   * @private
   * @param {Response} res
   * @returns
   *
   * @memberOf SecureService
   */
  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }

    let body = {};
    // if there is some content, parse it
    if (res.status !== 204) {
      body = res.json();
    }

    return body || {};
  }

  /**
   *
   *
   * @private
   * @param {*} error
   * @returns
   *
   * @memberOf SecureService
   */
  private handleAPIResponse<T>(apiResponse, url: string) {
    let result = {
      apiUrl: url,
      data: null,
      messageKey: '',
      status: 'responseStatus.Success'
    };
    result.messageKey = apiResponse.code;
    if (apiResponse.code.slice(6, 9) === '000' || apiResponse.code === 'SACM10001') {
      result.data = apiResponse.data;
    }
    else if (apiResponse.code.slice(6, 9) === '005') {
      result.status = 'responseStatus.Timeout';
    }
    else {
      result.status = 'responseStatus.APIError';
    }

    return result;
  }

  private handleError<T>(status: any, url: string) {
    let result = {
      apiUrl: url,
      data: null,
      messageKey: 'DefaultError',
      status: 'responseStatus.Failure'
    };

    if (status === 500) {
      result.status = 'responseStatus.Failure';
    }
    else if (status === 401 || status === 403) {
      result.status = 'responseStatus.NotAuthorized';
      result.messageKey = 'NotAuthorized';
    }
    else if (status === 404 || status === 503) {
      result.status = 'responseStatus.ApiNotAvailable';
    }


    //log the error
    return Observable.throw(result);
  }

}
