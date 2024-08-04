#include <curl/curl.h>
#include <iostream>

using namespace std;

int main() {
    CURL *curl;
    CURLcode result;

    curl = curl_easy_init();
    if(curl == NULL) {
    
        return -1;
    }

    return 0;
}