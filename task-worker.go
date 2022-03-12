/**
 * MIT License
 *
 * Copyright (c) 2021 David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

package main

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"time"

	camundaclientgo "github.com/citilinkru/camunda-client-go/v2"
	"github.com/citilinkru/camunda-client-go/v2/processor"
	log "github.com/sirupsen/logrus"
)

 const (
	 // DefaultCamundaURL is the default URL for Camunda
	 DefaultCamundaURL = "https://sentiment.camunda.com:8443"
	 // DefaultCamundaUser is the default user for Camunda
	 DefaultCamundaUser = "davidgs"
	 // DefaultCamundaPassword is the default password for Camunda
	 DefaultCamundaPassword = "Toby66.Mime!"
	 // DefaultCamundaClientTimeout is the default timeout for Camunda
	 DefaultCamundaClientTimeout = time.Second * 10
	 // DefaultCamundaProcessDefinition is the default process definition for Camunda
	 DefaultCamundaProcessDefinition = "task-worker"

	 // DefaultOrbitURL is the default URL for Orbit
	 DefaultOrbitURL = "https://app.orbit.love/api/v1/camunda/organizations?query&page&direction=DESC&items=100&sort=members_count"
	 // DefaultOrbit API key
	 DefaultOrbitAPIKey = "obu_oMdW2GEjOJiTIVxx2AS38l9OM8ptwasx_ddqJ5yA"
	 // DefaultAirtableURL is the default URL for Airtable
	 DefaultAirtableURL = "https://api.airtable.com/v0/"
	 //DefaultAirtableAPIKey is the default API key for Airtable
	 DefaultAirtableAPIKey = "keycNYs4vDaTYWIQQ"
	 // DefaultAirtableBaseID is the default base ID for Airtable
	 DefaultAirtableBaseID = "appk9RU4oePua1fyY"
	 // DefaultAirtableTableName is the default table name for Airtable
	 DefaultAirtableTableName = "Table%201"
 )

 type OrbitData struct {
	Data []struct {
		ID         string `json:"id"`
		Type       string `json:"type"`
		Attributes struct {
			ID             string    `json:"id"`
			Name           string    `json:"name"`
			Website        string    `json:"website"`
			MembersCount   int       `json:"members_count"`
			EmployeesCount int       `json:"employees_count"`
			LastActive     time.Time `json:"last_active"`
			ActiveSince    time.Time `json:"active_since"`
		} `json:"attributes"`
	} `json:"data"`
	Links struct {
		First string      `json:"first"`
		Last  string      `json:"last"`
		Prev  interface{} `json:"prev"`
		Next  string      `json:"next"`
	} `json:"links"`
}

type AirtableData struct {
	Records []struct {
		Fields struct {
			ID            string `json:"ID"`
			Type string `json:"Type"`
			Name          string `json:"Name"`
			Website       string `json:"Website"`
			MemberCount   int    `json:"MemberCount"`
			EmployeeCount int    `json:"EmployeeCount"`
			LastActive    string `json:"LastActive"`
			ActiveSince   string `json:"ActiveSince"`
		} `json:"fields"`
	} `json:"records"`
}

func main() {
	logger := func(err error) {
		log.Error(err)
	}
	var (
		camundaURL      = DefaultCamundaURL
		camundaUser     = DefaultCamundaUser
		camundaPassword = DefaultCamundaPassword
		// camundaTimeout  = DefaultCamundaClientTimeout
		//camundaProcess  = DefaultCamundaProcessDefinition
	)

	// Parse command line arguments
	for i := 0; i < len(os.Args); i++ {
		switch os.Args[i] {
		case "-u":
			camundaURL = os.Args[i+1]
			i++
		case "-U":
			camundaUser = os.Args[i+1]
			i++
		case "-p":
			camundaPassword = os.Args[i+1]
			i++
		// case "-t":
		// 	camundaTimeout, _ = time.ParseDuration(os.Args[i+1])
		// 	i++
		// case "-P":
		// 	camundaProcess = os.Args[i+1]
		// 	i++
		}
	}
	asyncResponseTimeout := 5000
	// Create a new Camunda client
	client := camundaclientgo.NewClient(camundaclientgo.ClientOptions{
		UserAgent:   "",
		EndpointUrl: camundaURL + "/engine-rest",
		Timeout: time.Second * 10,
		ApiUser: camundaUser,
		ApiPassword: camundaPassword,
	},
	)

	// Create a new Camunda processor
	proc := processor.NewProcessor(client, &processor.ProcessorOptions{
		WorkerId:                  "OrbitAirtable",
		LockDuration:              time.Second * 20,
		MaxTasks:                  10,
		MaxParallelTaskPerHandler: 100,
		LongPollingTimeout:        25 * time.Second,
		AsyncResponseTimeout:      &asyncResponseTimeout,
	}, logger)
	log.Debug("Processor started ... ")
	// add a handler for checking the existing Queue
	proc.AddHandler(
		&[]camundaclientgo.QueryFetchAndLockTopic{
			{TopicName: "process_data"},
		},
		func(ctx *processor.Context) error {
			return handleProcess(ctx.Task.Variables, ctx)
		},
	)

	// Create a new HTTP client
	// httpClient := &http.Client{
	// 	Transport: &http.Transport{
	// 		TLSClientConfig: &tls.Config{
	// 			InsecureSkipVerify: true,
	// 		},
	// 	},
	// 	CheckRedirect: func(req *http.Request, via []*http.Request) error {
	// 		return http.ErrUseLastResponse
	// 	},
	// 	Jar:     nil,
	// 	Timeout: DefaultCamundaClientTimeout,
	// }
	log.Debug("checkQueue Handler started ... ")
	http.HandleFunc("/sentiment", webHandler)
	http.Handle("/", http.FileServer(http.Dir("./static")))
	err := http.ListenAndServe(":9999", nil)
	if err != nil {
		log.Fatal(err)
	}

	// Get orbit data from Airtable
// 	orbitData, err := getOrbitData(httpClient)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// //	fmt.Printf("Data: %+v\n", orbitData)
// 	airtableData, err := processData(orbitData)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	//fmt.Printf("Data: %+v\n", airtableData)
// 	err = postAirtableData(httpClient, airtableData)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
}

func webHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
	fmt.Println("Hello")
}
func handleProcess(variables map[string]camundaclientgo.Variable, ctx *processor.Context) error {
	fmt.Println("Processing task ... ")
	fmt.Printf("Variables: %+v\n", variables)
	varb := ctx.Task.Variables
	fmt.Printf("Variables: %+v\n", varb)
	orbitData, err := getOrbitData()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Data: %+v\n", orbitData)
	table_name :=fmt.Sprintf("%v", ctx.Task.Variables["table_name"].Value)
	base_id := fmt.Sprintf("%v", ctx.Task.Variables["base_id"].Value)
	clear_table := fmt.Sprintf("%v", ctx.Task.Variables["clear_table"].Value)
	fmt.Println("Table Name: ", table_name)
	fmt.Println("Base ID: ", base_id)
	err = processData(orbitData, base_id, table_name, clear_table)
	if err != nil {
		log.Fatal(err)
	}
	// Get the Camunda variables
	err = ctx.Complete(processor.QueryComplete{Variables: &varb})
		if err != nil {
			log.Error("queuStatus: ", err)
			return err
		}
		return nil
}

func getOrbitData() (OrbitData, error){
	var orbitData OrbitData
	httpClient := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{
				InsecureSkipVerify: true,
			},
		},
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
		Jar:     nil,
		Timeout: DefaultCamundaClientTimeout,
	}
	// Create a new HTTP request
	req, err := http.NewRequest("GET", DefaultOrbitURL, nil)
	if err != nil {
		return orbitData, err
	}
	req.Header.Add("Authorization", "Bearer "+DefaultOrbitAPIKey)
	// Get orbit data
	response, err := httpClient.Do(req)
	if err != nil {
		return orbitData, err
	}

	// Parse orbit data
	err = json.NewDecoder(response.Body).Decode(&orbitData)
	if err != nil {
		return orbitData, err
	}

	return orbitData, nil
}

func getAirtableData(httpClient *http.Client) (AirtableData, error) {
	var airtableData AirtableData

	// Get orbit data from Airtable
	response, err := http.Get("https://api.airtable.com/v0/app4qgZqoqpvj8z7R/Orbit?api_key=key0vY8W7RZ1XKj9X")
	if err != nil {
		return airtableData, err
	}

	// Parse orbit data from Airtable
	err = json.NewDecoder(response.Body).Decode(&airtableData)
	if err != nil {
		return airtableData, err
	}

	return airtableData, nil
}

func processData(orbitData OrbitData, base_id string, table_name string, clear_table string) ( error) {
	airtableData := AirtableData{}
	if clear_table == "true" {
		
	fmt.Println("Base ID: ", base_id)
	fmt.Println("Table Name: ", table_name)
	recordCounter := 0;
	for _, data := range orbitData.Data {
		if recordCounter > 9 {
			err := postAirtableData(http.DefaultClient, airtableData, base_id, table_name)
			if err != nil {
				return err
			}
			airtableData = AirtableData{}
			recordCounter = 0
		}
		airtableData.Records = append(airtableData.Records, struct {
			Fields struct {
				ID            string `json:"ID"`
				Type string `json:"Type"`
				Name          string `json:"Name"`
				Website       string `json:"Website"`
				MemberCount   int    `json:"MemberCount"`
				EmployeeCount int    `json:"EmployeeCount"`
				LastActive    string `json:"LastActive"`
				ActiveSince   string `json:"ActiveSince"`
			} `json:"fields"`
		}{
			Fields: struct {
				ID            string `json:"ID"`
				Type string `json:"Type"`
				Name          string `json:"Name"`
				Website       string `json:"Website"`
				MemberCount   int    `json:"MemberCount"`
				EmployeeCount int    `json:"EmployeeCount"`
				LastActive    string `json:"LastActive"`
				ActiveSince   string `json:"ActiveSince"`
			}{
				ID:            data.ID,
				Type:          data.Type,
				Name:          data.Attributes.Name,
				Website:       data.Attributes.Website,
				MemberCount:   data.Attributes.MembersCount,
				EmployeeCount: data.Attributes.EmployeesCount,
				LastActive:    data.Attributes.LastActive.Format("2006-01-02"),
				ActiveSince:   data.Attributes.ActiveSince.Format("2006-01-02"),
			},
		})
		recordCounter++
	}
	return nil
}

func postAirtableData(httpClient *http.Client, airtableData AirtableData, base_id string, table_name string) error {
	// Create a new HTTP request
	x := url.PathEscape(table_name)
	fmt.Println("Table Name: ", x)
	req, err := http.NewRequest("POST", DefaultAirtableURL + base_id + "/" +  x, nil)
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+DefaultAirtableAPIKey)
	if err != nil {
		return err
	}
	fmt.Println("URL: ", req.URL)
	payload, err := json.Marshal(airtableData)
	if err != nil {
		return err
	}
	fmt.Println(string(payload))
	req.Body = ioutil.NopCloser(bytes.NewReader(payload))
	req.Header.Add("Content-Type", "application/json")
	// Get orbit data from Airtable
	response, err := httpClient.Do(req)
	if err != nil {
		return err
	}
	fmt.Println("Status: ", response.Status)
	// Parse orbit data from Airtable
	err = json.NewDecoder(response.Body).Decode(&airtableData)
	if err != nil {
		return err
	}
	fmt.Println(response.Body)

	return nil
}