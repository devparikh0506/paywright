# InvoicesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**invoicesGet**](#invoicesget) | **GET** /api/v1/invoices/{id} | Get an invoice|
|[**invoicesList**](#invoiceslist) | **GET** /api/v1/invoices | List invoices, optionally by customer|

# **invoicesGet**
> Invoice invoicesGet()


### Example

```typescript
import {
    InvoicesApi,
    Configuration
} from '@paywright/sdk';

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

**Invoice**

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

# **invoicesList**
> InvoiceList invoicesList()


### Example

```typescript
import {
    InvoicesApi,
    Configuration
} from '@paywright/sdk';

const configuration = new Configuration();
const apiInstance = new InvoicesApi(configuration);

let customerId: string; // (optional) (default to undefined)
let limit: any; // (optional) (default to undefined)
let page: any; // (optional) (default to undefined)

const { status, data } = await apiInstance.invoicesList(
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

**InvoiceList**

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

