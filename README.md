# node_exercise

1. 글생성
2. post 방식으로 데이터 받기
3. 파일생성 리다이렉션
4. 글수정 수정링크생성
5. 글수정 수정 정보 전송
6. 글수정 파일명 변경, 내용 저장
7. 글 삭제 삭제 기능
8. 템플릿 기능 정리
9. 모듈 형식
10. 모듈 활용
11. 입력 정보 보안
12. 출력 정보 보안
13. 출력 정보 보안
14. API / Create Server


# node express install 
1. 새로운 프로젝트 시     
 - express -ejs 프로젝트 명     
2. 기존 프로젝트에 exrpess 설치      
- npm init    
- npm install express --save(Express를 설치한 후 종속 항목 목록에 저장/종속 항목 목록에 추가하지 않으려면, 다음과 같이 --save 옵션을 생략/--save 옵션을 통해 설치된 Node 모듈은 package.json 파일 내의 dependencies 목록에 추가됩니다. 이후 app 디렉토리에서 npm install을 실행하면 종속 항목 목록 내의 모듈이 자동으로 설치)
- npm install --save-dev ejs (--save-dev : dev dependency 에 추가됨)    
https://kdydesign.github.io/2017/07/15/nodejs-npm-tutorial/ 
- npm install 
# node template engine 
 - 혼자 개발 할때는 jade / 협업 할때는 ejs 
 - 템플릿 엔진은 엔진을 통해서 html 문법으로 변환시켜 줌
