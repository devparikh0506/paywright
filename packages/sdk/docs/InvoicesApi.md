# InvoicesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**invoicesGet**](#invoicesget) | **GET** /api/v1/invoices/{id} | Get an invoice|
|[**invoicesList**](#invoiceslist) | **GET** /api/v1/invoices | List invoices, optionally by customer|

# **invoicesGet**
> invoicesGet()


### Example

```typescript
import {
    InvoicesApi,
    Configuration
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new InvoicesApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.invoicesGet(
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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **invoicesList**
> invoicesList()


### Example

```typescript
import {
    InvoicesApi,
    Configuration
} from 'paykit';

const configuration = new Configuration();
const apiInstance = new InvoicesApi(configuration);

let customerId: string; // (default to undefined)

const { status, data } = await apiInstance.invoicesList(
    customerId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerId** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

