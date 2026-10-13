package com.ohgiraffers.springdatajpa.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/* 설명. Swagger는 OpenAPI Specification(OAS)이다.
 *  Swagger는 build.gradle에 의존성을 추가해야 한다.
 *  이 때, SpringBoot 메이저 버전에 따라 전혀 다른 설명과 내용이 나오니 버전을 먼저 선택해야 한다.
 *  (https://springdoc.org/#migrating-from-springdoc-v1)
 *  ┌-------------------------------------------------------┐
 *  | springboot    | springdoc-openapi                     |
 *  |-------------------------------------------------------|
 *  | v2.x          | v1.x (https://springdoc.org/v1/)      |
 *  |- - - - - - - - - - - - - - - - - - - - - - - - - - - -|
 *  | v3.x          | v2.x (https://springdoc.org/)         |
 *  | v3.3.x        | v2.6.x                                |
 *  | v3.4.x~3.5.x  | v2.7.x ~ v2.8.x                       |
 *  |- - - - - - - - - - - - - - - - - - - - - - - - - - - -|
 *  | v4.x          | v3.x (2.x는 Spring Boot 4.x 미지원)   |
 *  | v4.1.x        | v3.1.0 (본 프로젝트에서 사용)         |
 *  └-------------------------------------------------------┘
 *  특별히 다른 설정을 하지 않는다면 디폴트 설정에 의해 아래 경로로 몇 가지 요청을 처리할 수 있다.
 *  추가적인 설정이나 커스텀 설정은 SpringBoot Configuration 파일인 application.yaml에서 정의할 수 있다.
 *  1. http://server:port/context-path/swagger-ui.html
 *     API 문서화 도구인 Swagger UI 페이지로 redirect되며,
 *     모든 엔드 포인트, 요청 방식, 응답 형식 등을 읽어와 웹 페이지 형태로 렌더링해준다.
 *  2. http://server:port/context-path/v3/api-docs
 *     해당 애플리케이션의 OpenAPI 명세서를 JSON 형식으로 응답하며,
 *     이 JSON 문자열에 애플리케이션의 모든 요청/응답 정보들이 담겨있기 때문에 커스텀 API 문서를 제작할 수도 있다.
 * */

/* 설명. Swagger 설정 방식 #1: 어노테이션 기반 설정 (@OpenAPIDefinition)
 *  - 특징: 클래스 상단에 @OpenAPIDefinition 어노테이션을 붙여 선언적으로 설정한다.
 *  - 장점: 코드가 간결하고 직관적이며 설정이 간편하다.
 *  - 단점: 정적인 값만 사용 가능하므로 env나 application.yaml 파일에 정의된 환경 변수에 따른 동적 설정이나
 *          복잡한 로직 추가에 한계가 있다.
 * */
//@OpenAPIDefinition(
//        info = @Info(title = "REST API Lecture API 명세서",
//                description = "REST API 수업용 프로젝트의 API 명세서 입니다.",
//                version = "v1",
//                contact = @Contact(
//                        name = "Ohgiraffers 강사팀",
//                        email = "owl.ohgiraffers@gmail.com"
//                )
//        )
//)
//@Configuration
//public class SwaggerConfig {
//}

// ===================================================================================================================

/* 설명. Swagger 설정 방식 #2: Bean 등록 기반 설정 (OpenAPI Bean)
 *  - 특징: 자바 코드로 OpenAPI 객체를 직접 생성하여 스프링 빈으로 등록한다.
 *  - 장점: 프로그래밍 방식이므로 유연하며, 조건별 설정이나 외부 설정 값 연동 등 동적 구성이 가능하다.
 *  - 단점: 어노테이션 방식에 비해 코드가 다소 복잡해질 수 있고 유지보수성이 떨어질 수 있다.
 * */
@Configuration
public class SwaggerConfig {

    /* http://localhost:8080/swagger-ui/index.html 확인 경로 */
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(apiInfo());
    }

    private io.swagger.v3.oas.models.info.Info apiInfo() {
        return new io.swagger.v3.oas.models.info.Info()
                .title("REST API Lecture API 명세서")
                .description("REST API 수업용 프로젝트의 API 명세서 입니다.")
//                .version("v.1");        // 숫자가 아닌 문자열 파라미터라서 입력하는 대로 출력됨
                .version("1.0.0");
    }
}
