# PlansApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**plansArchive**](#plansarchive) | **POST** /api/v1/plans/{id}/archive | Archive a plan (prices are immutable in Stripe)|
|[**plansCreate**](#planscreate) | **POST** /api/v1/plans | Create a plan (Stripe product + price)|
|[**plansGet**](#plansget) | **GET** /api/v1/plans/{id} | Get a plan|
|[**plansList**](#planslist) | **GET** /api/v1/plans | List plans|

# **plansArchive**
> plansArchive()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.plansArchive(
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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **plansCreate**
> plansCreate(createPlanDto)


### Example

```typescript
import {
    PlansApi,
    Configuration,
    CreatePlanDto
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

let createPlanDto: CreatePlanDto; //

const { status, data } = await apiInstance.plansCreate(
    createPlanDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPlanDto** | **CreatePlanDto**|  | |


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

# **plansGet**
> plansGet()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.plansGet(
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

# **plansList**
> plansList()


### Example

```typescript
import {
    PlansApi,
    Configuration
} from '@dev_parikh/paykit';

const configuration = new Configuration();
const apiInstance = new PlansApi(configuration);

let activeOnly: string; // (default to undefined)

const { status, data } = await apiInstance.plansList(
    activeOnly
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **activeOnly** | [**string**] |  | defaults to undefined|


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

