# CustomersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**customersCreate**](#customerscreate) | **POST** /api/v1/customers | Create a customer|
|[**customersGet**](#customersget) | **GET** /api/v1/customers/{id} | Get a customer|
|[**customersList**](#customerslist) | **GET** /api/v1/customers | List customers|
|[**customersRemove**](#customersremove) | **DELETE** /api/v1/customers/{id} | Delete a customer|
|[**customersUpdate**](#customersupdate) | **PATCH** /api/v1/customers/{id} | Update a customer|

# **customersCreate**
> customersCreate(createCustomerDto)


### Example

```typescript
import {
    CustomersApi,
    Configuration,
    CreateCustomerDto
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

let createCustomerDto: CreateCustomerDto; //

const { status, data } = await apiInstance.customersCreate(
    createCustomerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createCustomerDto** | **CreateCustomerDto**|  | |


### Return type

void (empty response body)

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersGet**
> customersGet()


### Example

```typescript
import {
    CustomersApi,
    Configuration
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.customersGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersList**
> customersList()


### Example

```typescript
import {
    CustomersApi,
    Configuration
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

const { status, data } = await apiInstance.customersList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersRemove**
> customersRemove()


### Example

```typescript
import {
    CustomersApi,
    Configuration
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.customersRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **customersUpdate**
> customersUpdate(updateCustomerDto)


### Example

```typescript
import {
    CustomersApi,
    Configuration,
    UpdateCustomerDto
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new CustomersApi(configuration);

let id: string; // (default to undefined)
let updateCustomerDto: UpdateCustomerDto; //

const { status, data } = await apiInstance.customersUpdate(
    id,
    updateCustomerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateCustomerDto** | **UpdateCustomerDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[x-api-key](../README.md#x-api-key)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

