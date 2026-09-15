import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;



public class index{
        public static void main(String args[]) throws IOException {
                // create a java server
                //HttpServer server = HttpServer.create(
                //new InetSocketAddress(5500)
                HttpServer server = HttpServer.create(
                        new InetSocketAddress(8080),
                        0 
                );
                //create api
                server.createContext("/api/hello", (HttpExchange exchange)->{
                        // allow frontend to connect
                        exchange.getResponseHeaders().add(
                                "Access-Control-Allow-Origin",
                                "*"
                        );
                        exchange.getResponseHeaders().add(
                                "Access-Control-Allow-Methods",
                                "GET,OPTIONS"
                        );


                        // tell broweser that we are sending text
                        exchange.getResponseHeaders().add(
                                "Content-Type",
                                "text/plain;charset=UTF-8"   
                        );
                        String response = "Hello from Java backend";
                        //send responce 
                        exchange.sendResponseHeaders(
                                200,
                                response.getBytes().length
                        );
                        exchange.getResponseBody().write(
                                response.getBytes()
                        );
                        exchange.getResponseBody().close();
                });

               


               

                //API 2 : SKILLS

                server.createContext(
                        "/api/skills",
                        (HttpExchange exchange) ->{
                                String response = 
                                "["
                                +"{"
                                +"\"name\":\"Java\","
                                +"\"demand\":\"90\","
                                +"\"level\":\"Industry Level Demand\""
                                +"},"

                                +"{"
                                +"\"name\":\"Python\","
                                +"\"demand\":\"95\","
                                +"\"level\":\" High Industry Level Demand\""
                                +"},"

                                +"{"
                                +"\"name\":\"SQL\","
                                +"\"demand\":\"85\","
                                +"\"level\":\"High Industry Level Demand\""
                                +"},"

                                +"{"
                                +"\"name\":\"Data Analytics\","
                                +"\"demand\":\"90\","
                                +"\"level\":\"Growing Industry Demand\""
                                +"}"

                                +"]";

                                sendResponse(
                                        exchange,
                                        response,
                                        "application/json"
                                );
                        }
                );

                // API 3: JOBS

                server.createContext(
                        "/api/jobs",
                        (HttpExchange exchange) ->{
                                String response = 
                                "["
                                +"{"
                                +"\"title\":\"Software Devloper\","
                                +"\"skills\":\"Java,Python,SQL\""
                                +"},"

                                +"{"
                                +"\"title\":\"Data Analyst\","
                                +"\"skills\":\"Python,SQL,Excel\""
                                +"},"

                                +"{"
                                +"\"title\":\"AI Engineer\","
                                +"\"skills\":\"Java,Machine Learning\""
                                +"}"

                                +"]";
                                sendResponse(
                                        exchange,
                                        response,
                                        "application/json"
                                );
                        
                        }
                        
                );

                //API 4 : PROGRAMS

                server.createContext(
                        "/api/programs",
                        (HttpExchange exchange) ->{
                                String response = 
                                "["

                                +"{"
                                +"\"name\":\"Java Full Stack Devlopment\","
                                +"\"skill\":\"Java\","
                                +"\"duration\":\"6 Months\""
                                +"},"

                                +"{"
                                +"\"name\":\"Python Programming\","
                                +"\"skill\":\"Python\","
                                +"\"duration\":\"4 Months\""
                                +"},"

                                +"{"

                                +"\"name\":\"SQL and Database Management\","
                                +"\"skill\":\"SQL\","
                                +"\"duration\":\"3 Months\""
                                +"},"

                                +"{"

                                +"\"name\":\"Data Analytics\","
                                +"\"skill\":\"Data\","
                                +"\"duration\":\"5 Months\""
                                +"}"

                                + "]";

                                sendResponse(
                                        exchange,
                                        response,
                                        "application/json"
                                );

                        }
                        
                );
               





                //START SERVER
                server.start();

                
                System.out.println("=================================");
                System.out.println("SkillBridge Java Backend Started!");
                System.out.println("=================================");
                System.out.println("Server: http://localhost:8080");
                System.out.println("Hello:http://localhost:8080/api/hello");
                System.out.println("Skills: http://localhost:8080/api/skills");
                System.out.println("Jobs: http://localhost:8080/api/jobs");
                System.out.println("Programs: http://localhost:8080/api/programs");
                System.out.println("=================================");
        }

         

        //COMMON RESPONSE MRTHOD
        public static void sendResponse(
                HttpExchange exchange,
                String response,
                String contentType
        ) throws IOException {
                // ALLOW FRONTEND TO CONNECT
                exchange.getResponseHeaders().add(
                        "Access-Control-Allow-Origin",
                        "*"
                );
                exchange.getResponseHeaders().add(
                        "Access-Control-Allow-Methods",
                        "GET,OPTIONS"
                );
                exchange.getResponseHeaders().add(
                        "Content-Type",
                        contentType + ";charset=UTF-8"
                );

                //convert response to bytes

                byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);

                // send HTTP Status 200

                exchange.sendResponseHeaders(
                        200,
                        responseBytes.length
                );

                // send response to browser
                exchange.getResponseBody().write(
                        responseBytes
                );

                // close connection
                exchange.getResponseBody().close();
        }
}