# PaymentsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**paymentsCancel**](#paymentscancel) | **POST** /api/v1/payments/{id}/cancel | Cancel an uncaptured payment|
|[**paymentsCreate**](#paymentscreate) | **POST** /api/v1/payments | Create a payment intent|
|[**paymentsGet**](#paymentsget) | **GET** /api/v1/payments/{id} | Get a payment|
|[**paymentsList**](#paymentslist) | **GET** /api/v1/payments | List payments, optionally by customer|
|[**paymentsRefund**](#paymentsrefund) | **POST** /api/v1/payments/{id}/refund | Refund a succeeded payment|

# **paymentsCancel**
> Payment paymentsCancel()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.paymentsCancel(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Payment**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentsCreate**
> CreatePaymentResult paymentsCreate(createPaymentDto)


### Example

```typescript
import {
    PaymentsApi,
    Configuration,
    CreatePaymentDto
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let createPaymentDto: CreatePaymentDto; //

const { status, data } = await apiInstance.paymentsCreate(
    createPaymentDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPaymentDto** | **CreatePaymentDto**|  | |


### Return type

**CreatePaymentResult**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentsGet**
> Payment paymentsGet()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.paymentsGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Payment**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentsList**
> PaymentList paymentsList()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let customerId: string; // (optional) (default to undefined)
let limit: any; // (optional) (default to undefined)
let page: any; // (optional) (default to undefined)

const { status, data } = await apiInstance.paymentsList(
    customerId,
    limit,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerId** | [**string**] |  | (optional) defaults to undefined|
| **limit** | **any** |  | (optional) defaults to undefined|
| **page** | **any** |  | (optional) defaults to undefined|


### Return type

**PaymentList**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **paymentsRefund**
> Payment paymentsRefund()


### Example

```typescript
import {
    PaymentsApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new PaymentsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.paymentsRefund(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**Payment**

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

