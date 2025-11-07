# 2. SDS (Software Design Specification)
## TTT (The Turing Test)

22313549 강승훈 qazx0502@naver.com  
22212017 김은강 dmsrkd5004@naver.com  
21912130 김정우 qwerlawjddn@gmail.com  
22211996 박종선 ballsun2003@gmail.com  
22012146 허태규 taegyu-heo@naver.com

---

## [ Revision history ]
| Revision date | Version # | Description | Author |
|---|---|---|---|
| 11/07/2025 | 1.0 | first draft | All team member |

---

## = Contents =
1. Introduction ....................................................................................... 5

2. Use case analysis ............................................................................. 6

3. Class diagram .................................................................................. 34

4. Sequence diagram ............................................................................ 45

5. State machine diagram .................................................................... 69

6. User interface prototype ................................................................. 70

7. Implementation requirements .......................................................... 87

8. Glossary ........................................................................................... 89

9. References ....................................................................................... 90

---

## = Authors for each section =
Introduction – 허태규  
Use case analysis – 강승훈, 김은강, 김정우, 박종선, 허태규  
Class diagram – 강승훈, 김은강, 김정우, 박종선, 허태규  
Sequence diagram – 박종선  
State machine diagram – 박종선  
User interface prototype - 김은강, 김정우, 허태규  
Implementation requirements - 허태규  
Glossary - 허태규  
References - 허태규

---

## 1. Introduction


---

## 2. Use case analysis
이번 장은 Use case diagram과 주요 Use case description을 제공한다. 다이어그램 및 설명에 관한 고려 사항은 다음과 같다.
- Use case diagram은 전체 시스템의 기능을 개괄적으로 보여주며, Use case description은 각 기능의 상세 흐름과 조건을 설명한다.
- 모든 Use case는 User level use case를 기준으로 작성되었다.
- 주요 액터(Actor)는 사용자(User)와 관리자(Administrator)이다. 시스템 내부의 AI 모델은 액터보다는 시스템의 일부로 간주한다.
- Use case description은 SRS의 요구사항 ID를 기반으로 작성되었다.

아래 그림은 본 프로젝트의 Use case diagram이다.  
![Use case diagram (p.6)](img/UD.png)

이번 장의 남은 부분은 주요 Use Case Description에 할당한다.

---

### Use case #1 : Post Search
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 이 use case는 게시글 검색 기능을 설명한다. |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김정우 |
| Last Update | 2025. 10. 30. |
| Status | Analysis |
| Primary Actor | User |
| Preconditions | 사용자가 시스템에 접속되어 있어야 한다. |
| Trigger | 사용자가 게시글 검색 기능을 사용하려 할 때 |
| Success Post Condition | 게시글 검색 기능의 결과가 인터페이스에 표시된다. |
| Failed Post Condition | 게시글 검색 기능의 결과가 반영되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 검색에 관련된 기능을 수행하려고 한다. |
| 1 | 사용자는 홈 화면이나 게시판 화면의 검색 창에서 제목, 내용, 글쓴이, 댓글 중 검색하고 싶은 분류를 선택한다. |
| 2 | 사용자는 검색 창에 단어를 입력한다. |
| 3 | 시스템은 선택한 분류에서 입력한 단어가 포함된 게시글을 보여준다. |
| 4 | 시스템은 게시글을 특정 수만큼 검색 후, 조건에 맞는 게시글을 제공한다. |
| 5 | 사용자가 다음이라는 버튼을 클릭하면 시스템은 다시 특정 수만큼 검색 후, 조건에 맞는 게시글을 제공한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 입력한 단어가 포함된 게시글이 없을 때 | 3a1. 게시글을 보여주지 않는다 |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 5 seconds |
| Frequency | 사용자당 일 3회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #2 : User Search
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 이 use case는 사용자 검색 기능을 설명한다. |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김정우 |
| Last Update | 2025. 10. 30. |
| Status | Analysis |
| Primary Actor | User |
| Preconditions | 사용자가 시스템에 접속되어 있어야 한다. |
| Trigger | 사용자가 사용자 검색 기능을 사용하려 할 때 |
| Success Post Condition | 사용자 검색 기능의 결과가 인터페이스에 표시된다. |
| Failed Post Condition | 사용자 검색 기능의 결과가 반영되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 사용자 검색에 관련된 기능을 수행하려고 한다. |
| 1 | 사용자는 게시글에서 글쓴이의 정보를 누른다. |
| 2 | 그 글쓴이가 작성한 게시글과 댓글을 모두 보여주는 창을 제공한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
|  |  |  |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 사용자당 주 2회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #3 : Post Evaluation
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 이 use case는 게시글 평가기능을 설명한다. |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김정우 |
| Last Update | 2025. 10. 30. |
| Status | Analysis |
| Primary Actor | User |
| Preconditions | 사용자가 시스템에 로그인 되어 있어야 한다. |
| Trigger | 사용자가 게시글에서 게시글 평가기능을 사용하려 할 때 |
| Success Post Condition | 게시글 평가기능의 결과가 적용된다. |
| Failed Post Condition | 게시글 평가기능의 결과가 반영되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 사용자 평가에 관련된 기능을 수행하려고 한다. |
| 1 | 사용자는 게시글에서 평가 버튼을 누른다. |
| 2 | 게시글의 가지고 있던 정보에 사용자가 평가한 수치를 업데이트한다. |
| 3 | 업데이트가 끝난 후 일정 수치를 만족하면 그 게시글을 인기 게시글로 분류한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 해당 게시글의 평가 버튼을 사용자가 이미 누른 적이 있다. | 2a1. 해당 사용자의 평가를 업데이트 하지 않는다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 사용자당 일 3회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #4 : 알림 설정
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 알림을 수신받을지 설정하기 위한 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 10. 27. |
| Status | Analysis (Finalize) |
| Primary Actor | 사용자 |
| Preconditions | 사용자는 로그인 인증이 완료되어야 한다. |
| Trigger | 사용자가 알림 수신을 허용/비허용으로 전환한다. |
| Success Post Condition | 사용자는 알림을 수신 받을 수 있/없다. |
| Failed Post Condition | 사용자의 설정이 이전으로 롤백 된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 알림 설정을 할 수 있다. |
| 1 | 사용자가 알림 설정을 전환한다. |
| 2 | 사용자의 알림 설정을 서버에 저장한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 알림 설정이 서버 저장에 실패하였다. | …2a1. 에러 메시지를 보여준다 . / ...2a2. 기존의 알림 설정으로 돌아간다.. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 2 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #5 : 알림 목록 보기
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 받은 알림들을 보기 위한 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 10. 27. |
| Status | Analysis (Finalize) |
| Primary Actor | 사용자 |
| Preconditions | 사용자는 로그인 인증이 완료되어야 한다. |
| Trigger | 사용자가 알림 목록 아이콘을 클릭한다. |
| Success Post Condition | 사용자는 수신 받은 알림 목록들을 볼 수 있다. |
| Failed Post Condition | 사용자는 수신 받은 알림 목록들을 볼 수 없다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 알림 목록을 볼 수 있다. |
| 1 | 사용자가 알림 목록 아이콘을 클릭한다 . |
| 2 | 서버에 사용자가 받은 알림 정보를 요청하고 반환한다. |
| 3 | 사용자가 수신받은 알림들을 보여준다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 서버에 요청한 알림 정보가 반환되지 않음. | …2a1. 에러 메시지를 보여준다 . / ...2a2. 알림 목록 화면에서 나간다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 2 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #6 : 알림 전송
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 시스템이 이벤트를 감지하고 알림을 전송하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | Subfunction level |
| Author | 김은강 |
| Last Update | 2025. 10. 27. |
| Status | Analysis (Finalize) |
| Primary Actor | 시스템 |
| Preconditions | 시스템이 이벤트를 감지하고 있어야한다. |
| Trigger | 시스템이 사용자의 게시글에 평가가 달리거나 댓글이 달리는 것을 감지한다. |
| Success Post Condition | 평가 내용이 게시글 작성자에게 알림으로 전송된다. |
| Failed Post Condition | 알림이 전송되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 시스템이 알림을 전송하려 한다. |
| 1 | 시스템이 사용자의 게시글에 평가가 달리거나 댓글이 달리는것을 감지한다 |
| 2 | 시스템이 평가 이벤트를 감지한다. |
| 3 | 시스템이 게시글 작성자에게 알림을 전송한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 시스템이 이벤트를 감지하지 못하였다. | 2a1. 이벤트를 다시 발생시킨다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 2번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #7 : 관리자 로그인
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 시스템에 관리자 권한을 인증받기 위한 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 10. 27. |
| Status | Analysis (Finalize) |
| Primary Actor | 관리자 |
| Preconditions | 시스템에 관리자 계정이 존재해야 한다. |
| Trigger | 관리자 권한을 가진 사용자가 아이디와 비밀번호를 입력하고 로그인 버튼을 누른다. |
| Success Post Condition | 관리자는 시스템의 사용자 정보를 관리할 수 있는 권한을 얻는다. |
| Failed Post Condition | 아무 권한을 얻지 못한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 관리자 권한을 가진 사용자가 로그인한다. |
| 1 | 로그인 화면에서 아이디와 패스워드를 입력하고 로그인 버튼을 클릭한다. |
| 2 | 시스템은 입력된 정보가 관리자 계정 정보와 일치하는지 확인한다. |
| 3 | 시스템은 입력된 정보가 관리자 계정 정보와 일치하면 관리자 권한이 주어진다. |
| 4 | 시스템은 로그인 성공 기록을 저장한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 입력한 정보가 관리자 계정과 일치하지 않는다. | 2a1. 에러 메시지를 보여준다. / 2a2. 시스템은 로그인 실패 기록을 저장한다. / 2a3. 로그인 화면으로 돌아가며 CAPTCHA 인증을 요구한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 2 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #8 : 사용자 정보 조회
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 관리자가 사용자의 정보를 조회하기 위한 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 10. 27. |
| Status | Analysis (Finalize) |
| Primary Actor | 관리자 |
| Preconditions | 사용자는 관리자 권한으로 시스템에 로그인 되어 있어야 한다. |
| Trigger | 관리자가 사용자 목록에서 특정 사용자를 클릭한다. |
| Success Post Condition | 사용자의 정보를 조회할 수 있다. |
| Failed Post Condition | 사용자의 정보를 조회할 수 없다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 관리자가 사용자의 정보를 조회할 수 있다.. |
| 1 | 관리자가 사용자 목록에서 특정 사용자를 클릭한다. |
| 2 | 시스템은 DB에서 특정 사용자의 정보를 쿼리하고 반환한다. |
| 3 | 시스템은 사용자에게 반환받은 사용자 정보를 보여준다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 서버에 요청한 정보가 반환되지 않았다. | …2a1. 에러 메시지를 보여준다 . / ...2a2. 사용자 목록화면으로 돌아간다.. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 1번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #9 : 사용자 정보 수정
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 관리자가 사용자의 정보를 수정하기 위한 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 10. 27. |
| Status | Analysis (Finalize) |
| Primary Actor | 관리자 |
| Preconditions | 사용자는 관리자 권한으로 시스템에 로그인 되어 있어야 한다. |
| Trigger | 관리자가 사용자 정보 화면에서 수정하기 버튼을 클릭한다. |
| Success Post Condition | 사용자의 정보를 수정할 수 있다. |
| Failed Post Condition | 사용자의 정보를 수정할 수 없다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 관리자가 사용자의 정보를 수정할 수 있다.. |
| 1 | 관리자가 사용자 정보 화면에서 수정하기 버튼을 클릭한다. |
| 2 | 사용자 정보를 수정할 수 있는 화면으로 이동한다. |
| 3 | 관리자는 사용자 정보를 수정한다. |
| 4 | 관리자는 확인 버튼을 클릭한다. |
| 5 | 서버에 수정된 정보를 저장한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 5 | 5a. 서버에 정보저장이 실패하였다. | …5a1. 에러 메시지를 보여준다 . / ...5a2. 4번 단계로 돌아간다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 1번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

## 3. Class diagram
이번 장은 시스템의 주요 클래스들과 그 관계를 보여주는 Class diagram을 제공한다. 전체 시스템 구조를 파악하기 위해 주요 도메인 및 서비스 클래스를 중심으로 설계하였다.  
![Class diagram (p.34)](img/CD.png)

---

### Evaluation 
**Class Description**: 특정 게시글에 대한 사용자의 LIKE/DISLIKE

**Attributes**
| Name | Type | Visibility | Description |
|---|---|---|---|
| id | string | private | 평가 ID |
| postId | string | private | 대상 게시글 ID |
| userId | string | private | 평가자 ID |
| type | EvalType | private | 평가 종류 |

**Operations**
| Name | Argument | Returns | Description |
|---|---|---|---|
| getId | none | string | 식별자 조회 |
| getPostId | none | string | 식별자 조회 |
| getUserId | none | string | 식별자 조회 |
| getType | none | EvalType  | 평가 종류 조회 |
| setType | t: EvalType | void | 평가 종류 변경 |

---

### Noti / AI
**Noti — Class Description**: 알림(제목/내용/아이콘/시간/읽음여부)

**Attributes**
| Name | Type | Visibility | Description |
|---|---|---|---|
| id | string | private | 알림 ID |
| title | string | private | 제목 |
| icon | string | private | 아이콘 |
| description | string | private | 내용 |
| date | Date | private | 생성 시각 |
| isRead | boolean | private | 읽음 여부 |

**Operations**
| Name | Argument | Returns | Description |
|---|---|---|---|
| getId | none | string | 기본 정보 조회 |
| getTitle | none | string | 기본 정보 조회 |
| getDescription | none | string | 기본 정보 조회 |
| getDate | none | Date | 기본 정보 조회 |
| isRead | content: string | boolean | 읽음 여부 조회 |
| setUpdatedAt | d: Date | void | 읽음 처리 |

---

### EvalService

**EvalService — Class Description**: 좋아요/싫어요 생성·삭제 + 알림 연동

**Operations**
| Name | Argument | Returns | Description |
|---|---|---|---|
| evaluate | postId: string, userId: string, type: EvalType | Evaluation | 평가 생성/토글 처리 |
| delete | id: string | void | 평가 삭제 |

---

### NotiService
**NotiService — Class Description**: 알림 전송/수신/읽음처리/삭제

**Operations**
| Name | Argument | Returns | Description |
|---|---|---|---|
| sendNoti | noti: Noti | boolean | 알림 전송 |
| receiveNoti | noti: Noti | Noti | 알림 수신 처리 |
| detectTrigger | none | int | 알림 트리거 감지 |
| markAsRead | noti: Noti | boolean | 읽음 표시 |
| deleteNoti | noti: Noti | Noti | 알림 삭제 |

---

### SearchBox / LoginScreen

**SearchBox — Class Description**: 분류+키워드 입력 → 게시글 검색 결과 반환

**Operations**
| Name | Argument | Returns | Description |
|---|---|---|---|
| onSubmit | field: SearchField, keyword: string | Post[] | 조건 기반 검색 |

---

### SignUpScreen / UserProfileScreen / NotiList

**NotiList — Class Description**: 알림 목록 화면

**Attributes**
| Name | Type | Visibility | Description |
|---|---|---|---|
| notiArray | Noti[] | private | 알림 목록 |

**Operations**
| Name | Argument | Returns | Description |
|---|---|---|---|
| getNotis | none | Noti[] | 전체 알림 조회 |
| getUnReadNotis | none | Noti[] | 읽지 않은 알림 조회 |

---

## 4. Sequence diagram

---

## 5. State machine diagram

---

## 6. User interface prototype


---

## 7. Implementation requirements


---

## 8. Glossary


---

## 9. References

