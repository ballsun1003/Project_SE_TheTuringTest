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
| 11/07/2025 | 2.0 | 완성된 SW에 맞추어 수정 | All team member |

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
본 문서는 "The Turing Test" 프로젝트의 Software Design Specification(SDS)이다. 이 프로젝트는 "죽은 인터넷 이론"에서 영감을 받아, AI가 생성한 콘텐츠로만 구성된 온라인 커뮤니티를 구축하여 이른바 “죽은 인터넷”을 구현한다. 나아가, 게시글 및 댓글의 생성 방식, 인증된 사용자와 인증되지 않은 사용자의 UI/UX적 차별 등을 통해 생성된 콘텐츠의 기반이 모두 실제 사람임을 표현하여 커뮤니티 사용자에게 이색적인 경험을 제공하는 것을 목표로 한다.

본 문서는 프로젝트의 Software Requirements Specification(SRS)에 명시된 기능적 요구사항들을 구현하기 위해 시스템을 다양한 관점에서 설계한다. Use case diagram과 Use case description은 사용자 관점에서 시스템이 제공하는 기능을 명확히 하고, Class diagram은 시스템의 정적 구조와 클래스 간의 관계를 보여준다. Sequence diagram과 State machine diagram은 시스템의 동적 행동과 상태 변화를 묘사한다. User interface prototype은 사용자가 시스템과 상호작용하는 화면의 예상 모습을 제시한다.

본 문서 작성 시 가장 중요하게 고려된 점은 SRS 요구사항의 충실한 반영과 다이어그램 간의 일관성 유지이다. 각 다이어그램은 SRS에 명시된 기능을 기반으로 하며, 다이어그램 간의 모순이 없도록 주의 깊게 작성되었다. 특히 Use case description은 Sequence diagram 설계의 주요 기반이 된다.

"The Turing Test" 시스템은 웹 기반 애플리케이션으로 개발될 예정이며, 사용자는 회원가입 및 로그인을 통해 커뮤니티 활동에 참여한다. 모든 게시글과 댓글 내용은 사용자가 입력한 프롬프트를 기반으로 AI 모델에 의해 생성되며, 이 과정에서 사용자는 CAPTCHA 등을 통해 인간임을 증명해야 한다.

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

### Use case #1 : 게시글 검색
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
| S | 사용자가 게시글 검색에 관련된 기능을 수행한다. |
| 1 | 사용자는 홈 화면이나 게시판 화면의 검색 창에서 제목, 내용, 글쓴이, 댓글 중 검색하고 싶은 분류를 선택한다. |
| 2 | 사용자는 검색 창에 단어를 입력한다. |
| 3 | 시스템은 선택한 분류에서 입력한 단어가 포함된 게시글을 표시한다. |
| 4 | 시스템은 게시글을 특정 수만큼 검색 후, 조건에 맞는 게시글을 제공한다. |
| 5 | 사용자가 '다음' 버튼을 클릭하면 시스템은 다시 특정 수만큼 검색 후, 조건에 맞는 게시글을 제공한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 입력한 단어가 포함된 게시글이 없을 때 | 3a1. 시스템은 게시글을 표시하지 않는다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 5 seconds |
| Frequency | 사용자당 일 3회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #2 : 사용자 검색
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
| S | 사용자가 사용자 검색에 관련된 기능을 수행한다. |
| 1 | 사용자는 게시글에서 작성자의 정보를 클릭한다. |
| 2 | 시스템은 해당 작성자가 작성한 게시글과 댓글을 모두 보여주는 창을 제공한다. |

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

### Use case #3 : 게시글 평가
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
| S | 사용자가 게시글 평가에 관련된 기능을 수행한다. |
| 1 | 사용자는 게시글에서 평가 버튼을 누른다. |
| 2 | 시스템은 게시글에 저장된 평가 수치를 사용자가 평가한 값으로 업데이트한다. |
| 3 | 업데이트가 끝난 후 일정 수치를 만족하면 시스템은 그 게시글을 인기 게시글로 분류한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 해당 게시글의 평가 버튼을 사용자가 이미 누른 적이 있다. | 2a1. 해당 사용자의 평가를 업데이트하지 않는다 (또는 취소 처리한다). |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 사용자당 일 3회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #4 : 알림 목록 보기
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
| S | 사용자가 알림 목록을 조회한다. |
| 1 | 사용자가 알림 목록 아이콘을 클릭한다. |
| 2 | 시스템은 서버에 사용자가 받은 알림 정보를 요청하고 반환한다. |
| 3 | 시스템은 사용자가 수신받은 알림들을 보여준다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 서버에 요청한 알림 정보가 반환되지 않음. | 2a1. 에러 메시지를 보여준다. / 2a2. 알림 목록 화면에서 나간다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 2 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #5 : 알림 전송
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
| Preconditions | 시스템이 이벤트를 감지하고 있어야 한다. |
| Trigger | 시스템이 사용자의 게시글에 평가가 달리거나 댓글이 달리는 것을 감지한다. |
| Success Post Condition | 평가 내용이 게시글 작성자에게 알림으로 전송된다. |
| Failed Post Condition | 알림이 전송되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 시스템이 알림을 전송한다. |
| 1 | 시스템이 사용자의 게시글에 평가가 달리거나 댓글이 달리는 것을 감지한다. |
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

### Use case #6 : 관리자 로그인
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
| 3 | 입력된 정보가 관리자 계정 정보와 일치하면 시스템은 관리자 권한을 부여한다. |
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

### Use case #7 : 사용자 정보 조회
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
| S | 관리자가 사용자의 정보를 조회한다. |
| 1 | 관리자가 사용자 목록에서 특정 사용자를 클릭한다. |
| 2 | 시스템은 DB에서 특정 사용자의 정보를 쿼리하고 반환한다. |
| 3 | 시스템은 사용자에게 반환받은 사용자 정보를 보여준다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 서버에 요청한 정보가 반환되지 않았다. | 2a1. 에러 메시지를 보여준다. / 2a2. 사용자 목록화면으로 돌아간다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 1번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #8 : 사용자 정보 수정
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
| S | 관리자가 사용자의 정보를 수정한다. |
| 1 | 관리자가 사용자 정보 화면에서 수정하기 버튼을 클릭한다. |
| 2 | 사용자 정보를 수정할 수 있는 화면으로 이동한다. |
| 3 | 관리자는 사용자 정보를 수정한다. |
| 4 | 관리자는 확인 버튼을 클릭한다. |
| 5 | 시스템은 수정된 정보를 서버에 저장한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 5 | 5a. 서버에 정보 저장이 실패하였다. | 5a1. 에러 메시지를 보여준다. / 5a2. 4번 단계로 돌아간다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 1번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #9 : 게시글 작성
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 입력한 프롬프트를 기반으로 AI가 본문을 자동 생성하여 게시글을 등록하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 10. 29. |
| Status | Analysis  |
| Primary Actor | User (Secondary Actor: AI Model) |
| Preconditions | 사용자는 로그인 상태여야 하며 게시글 작성 페이지에 접근해야 한다. |
| Trigger | 사용자가 제목과 프롬프트를 입력하고 “게시글 생성” 버튼을 클릭했을 때 |
| Success Post Condition | 게시글이 성공적으로 생성되어 목록에 등록된다. |
| Failed Post Condition | 입력이 누락되었거나 AI 본문 생성에 실패한 경우 게시글이 등록되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 작성 페이지에 접근한다. |
| 1 | 사용자는 제목과 프롬프트를 입력하고 “게시글 생성” 버튼을 클릭한다. |
| 2 | AI가 프롬프트를 기반으로 본문 내용을 자동 생성한다. |
| 3 | 시스템은 제목, 작성자, 생성된 본문을 저장한다. |
| 4 | 게시글 등록 후 사용자에게 게시글 상세 페이지로 리다이렉트된다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. AI 본문 생성 실패 | 2a1. 오류 메시지를 출력하고 사용자가 다시 시도할 수 있도록 한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 3 seconds |
| Frequency | 사용자당 일 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #10 : 게시글 수정
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 작성자가 기존 게시글을 프롬프트를 통해 수정 요청하면 AI가 내용을 자동 수정하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 10. 29. |
| Status | Analysis  |
| Primary Actor | User (Secondary Actors: AI Model) |
| Preconditions | 사용자는 해당 게시글의 작성자이며 로그인 상태여야 한다. |
| Trigger | 사용자가 수정 페이지에서 수정 프롬프트를 입력하고 “수정”버튼을 클릭했을 때 |
| Success Post Condition | 게시글이 수정되어 갱신된 내용이 저장된다. |
| Failed Post Condition | 수정 권한이 없거나 AI 수정 실패 시 게시글이 변경되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 본인이 작성한 게시글 상세 페이지에 접근한다. |
| 1 | 사용자는 수정 버튼을 클릭하고 프롬프트를 입력한다. |
| 2 | AI가 프롬프트를 기반으로 기존 내용을 자동 수정한다. |
| 3 | 수정된 내용이 저장되고 게시글 상세 페이지로 리다이렉트된다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. AI 수정 실패 시 | 2a1. 기존 게시글은 유지되며 오류 메시지를 출력한다. |
| 2 | 2b. 작성자가 아닐 경우 | 2b1. 수정 버튼이 활성화되지 않아 클릭할 수 없다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 3 seconds |
| Frequency | 사용자당 일 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #11 : 게시글 삭제
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 작성자 또는 관리자가 게시글을 삭제하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 10. 27. |
| Status | Analysis  |
| Primary Actor | User, Admin |
| Preconditions | 사용자는 로그인 상태이며 해당 게시글의 작성자이거나 관리자여야 한다. |
| Trigger | 사용자가 “삭제” 버튼을 클릭했을 때 |
| Success Post Condition | 게시글이 삭제되고 목록에서 제거된다. |
| Failed Post Condition | 삭제 권한이 없거나 오류 발생 시 삭제되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 상세 페이지에 접근한다. |
| 1 | 사용자가 “삭제” 버튼을 클릭한다. |
| 2 | 시스템은 권한을 검증하고, 권한이 유효할 경우 게시글을 삭제한다. |
| 3 | 삭제 완료 후 게시글 목록 페이지로 리다이렉트된다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 1 | 1a. 사용자가 작성자가 아니거나 관리자가 아닐 경우 | 1a1. 삭제 버튼이 비활성화되어 클릭할 수 없다 / 1a2. Use case는 종료된다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 1 seconds |
| Frequency | 사용자당 월 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #12 : 게시글 목록
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 등록된 게시글을 최신순으로 정렬하여 목록 형태로 보여주는 기능 |
| Scope | TTT (The Turing Test) |
| Level | System level |
| Author | 강승훈 |
| Last Update | 2025. 10. 27. |
| Status | Analysis  |
| Primary Actor | User |
| Preconditions | 사용자는 로그인 상태여야 하며 게시판 페이지에 접근해야 한다. |
| Trigger | 사용자가 게시판 페이지를 열었을 때 |
| Success Post Condition | 게시글 목록이 정상적으로 표시된다. |
| Failed Post Condition | 게시글 목록이 표시되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시판 페이지에 접근한다. |
| 1 | 시스템은 저장된 게시글 목록을 최신순으로 불러온다. |
| 2 | 시스템은 게시글 제목, 작성자, 작성일, 좋아요 수 등을 목록에 표시한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 1 seconds |
| Frequency | 사용자당 일 5회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #13 : 게시글 조회
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 목록에서 선택된 게시글의 상세 내용을 확인하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 10. 27. |
| Status | Analysis  |
| Primary Actor | User |
| Preconditions | 게시글이 존재해야 하며, 사용자는 목록 페이지에 접근 중이어야 한다. |
| Trigger | 사용자가 목록에서 게시글을 클릭했을 때 |
| Success Post Condition | 게시글의 제목, 본문, 작성자, 작성일 등이 상세히 표시된다. |
| Failed Post Condition | 게시글이 표시되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 목록 페이지에 접근한다. |
| 1 | 사용자가 특정 게시글을 클릭한다. |
| 2 | 시스템은 해당 게시글의 상세 정보를 불러와 화면에 표시한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 사용자당 일 20회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #14 : 회원가입
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 시스템 사용을 위해 새 계정을 생성하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 박종선 |
| Last Update | 2025. 11. 04. |
| Status | Analysis (Finalize) |
| Primary Actor | 사용자 |
| Preconditions | 사용자가 사이트에 접속되어 있어야 한다. |
| Trigger | 사용자가 회원가입 페이지에 접근할 때 |
| Success Post Condition | 사용자 계정이 생성된다. |
| Failed Post Condition | 사용자 계정이 생성되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 회원가입을 시도한다. |
| 1 | 사용자는 이용약관 및 개인정보 수집에 대한 내용을 확인하고 동의 체크박스를 선택한다. |
| 2 | 사용자는 회원가입 페이지에서 이메일, 비밀번호, 비밀번호 확인, 닉네임을 입력한다. |
| 3 | 시스템은 입력된 이메일 주소 형식이 유효한지, 이미 사용중인 계정이 있는지 검사한다. |
| 4 | 시스템은 입력된 비밀번호의 유효성을 검사하고, 비밀번호와 비밀번호 확인 입력값이 일치하는지 확인한다. |
| 5 | 사용자는 CAPTCHA를 수행한다. |
| 6 | 사용자가 '회원가입' 버튼을 클릭한다. |
| 7 | 시스템은 유효한 요청에 대해, 입력된 비밀번호를 단방향 암호화하여 사용자 계정 정보를 데이터베이스에 저장한다. |
| 8 | 시스템은 회원가입 성공 메시지를 표시하고 사용자를 메인 화면으로 이동시킨다. |
| 9 | 시스템은 Use case #18(CAPTCHA)을 실행하여 봇 방지 인증을 수행한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 이메일 형식이 유효하지 않음 | 3a1. 시스템은 오류 메시지를 표시한다. / 3a2. Step 2로 돌아간다. |
| 3 | 3b. 이메일이 이미 존재함 | 3b1. 시스템은 오류 메시지를 표시한다. / 3b2. Step 2로 돌아간다. |
| 4 | 4a. 비밀번호 규칙 위반 | 4a1. 시스템은 오류 메시지를 표시한다. / 4a2. Step 2로 돌아간다. |
| 4 | 4b. 비밀번호와 비밀번호 확인 불일치 | 4b1. 시스템은 오류 메시지를 표시한다. / 4b2. Step 2로 돌아간다. |
| 5 | 5a. CAPTCHA 인증 실패 | 5a1. 시스템은 오류 메시지를 표시하고 새로운 CAPTCHA를 제공한다. / 5a2. Step 5로 돌아간다. |
| 7 | 7a. 데이터베이스 저장 실패 | 7a1. 시스템은 오류 메시지를 표시한다. / 7a2. Use case는 종료된다. |
| 8 | 8a. 이메일 발송 오류 | 8a1. 이메일 오입력 등으로 발송이 실패할 경우 고객센터에 문의하라는 메시지를 표시한다. / 8a2. 관리자 개입 등을 통해 문제를 해결한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 5 seconds |
| Frequency | 사용자당 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025. 11. 07. |

---

### Use case #15 : 로그인
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 등록된 계정으로 시스템에 접속하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 박종선 |
| Last Update | 2025. 11. 04. |
| Status | Analysis (Finalize) |
| Primary Actor | 사용자 |
| Preconditions | 사용자가 시스템에 유효한 계정을 가지고 있어야 한다. |
| Trigger | 사용자가 로그인 페이지에 접근할 때 |
| Success Post Condition | 사용자가 시스템에 로그인된다. |
| Failed Post Condition | 사용자가 로그인되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 로그인을 시도한다. |
| 1 | 사용자는 로그인 페이지에서 이메일과 비밀번호를 입력한다. |
| 2 | 사용자가 '로그인' 버튼을 클릭한다. |
| 3 | 시스템은 계정이 존재하고 비밀번호가 일치하는지 확인한다. |
| 4 | 시스템은 해당 계정이 활성화 상태인지 확인한다. |
| 5 | 시스템은 사용자를 로그인 상태로 전환하며 메인 화면으로 이동시킨다. |
| 6 | 시스템은 로그인 성공 기록을 데이터베이스에 저장한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 해당 이메일의 계정이 존재하지 않음 | 3a1. 시스템은 오류 메시지를 표시한다. / 3a3. 시스템은 로그인 실패 기록을 저장한다. / 3a4. Step 1로 돌아간다. |
| 3 | 3b. 비밀번호 불일치 | 3a1. 시스템은 오류 메시지를 표시한다. / 3a3. 시스템은 로그인 실패 기록을 저장한다. / 3b4. 시스템은 사용자에게 CAPTCHA 인증을 요구한다. / 3a4. CAPTCHA 성공시 Step 1로 돌아간다, CAPTCHA 실패시 3b4로 돌아간다. |
| 4 | 4a. 계정 비활성화 상태 | 4a1. 시스템은 오류 메시지를 표시한다. / 4a2. 시스템은 로그인 시도 실패 기록을 저장한다. / 4a3. Use case #18(CAPTCHA)을 실행 후 Use case는 종료된다. |
| 4 | 4b. 계정 정지로 인한 계정 비활성화 상태 | 4b1. 시스템은 오류 메시지를 표시한다. / 4b2. 시스템은 로그인 시도 실패 기록을 저장한다. / 4b3. Use case는 종료된다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 사용자당 하루 평균 2회 |
| Concurrency | 제한 없음 |
| Due Date | 2025. 11. 07. |

---

### Use case #16 : 로그아웃
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 현재 로그인 세션을 종료하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 박종선 |
| Last Update | 2025. 11. 04. |
| Status | Analysis (Finalize) |
| Primary Actor | 사용자 |
| Preconditions | 사용자가 시스템에 로그인 되어 있어야 한다. |
| Trigger | 사용자가 로그아웃 버튼을 클릭할 때 |
| Success Post Condition | 사용자가 시스템에서 로그아웃된다. |
| Failed Post Condition | 사용자가 로그아웃되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 로그아웃을 시도한다. |
| 1 | 사용자가 '로그아웃' 버튼을 클릭한다. |
| 2 | 시스템은 요청받은 세션 또는 토큰을 즉시 무효화한다. |
| 3 | 시스템은 사용자를 로그아웃 상태로 전환하며 메인 화면으로 이동시킨다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 세션/토큰 무효화 실패 | 2a1. 시스템은 오류 메시지를 표시한다. / 2a2. Use case는 종료된다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 사용자당 하루 평균 2회 |
| Concurrency | 제한 없음 |
| Due Date | 2025. 11. 07. |

---

### Use case #17 : 내 정보 관리
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 자신의 정보를 조회하고 변경할 수 있는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 박종선 |
| Last Update | 2025. 11. 04. |
| Status | Analysis (Finalize) |
| Primary Actor | 사용자 |
| Preconditions | 사용자가 시스템에 로그인 되어 있어야 한다. |
| Trigger | 사용자가 내 정보 관리 기능에 접속할 때 |
| Success Post Condition | 사용자의 정보가 변경/조회된다. |
| Failed Post Condition | 사용자의 정보 변경/조회가 실패한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 내 정보 관리 화면에 진입을 시도한다. |
| 1 | 시스템은 사용자에게 비밀번호 재입력 및 Use case #18을 통해 CAPTCHA 인증을 요구한다. |
| 2 | 사용자는 현재 비밀번호를 입력하고 CAPTCHA를 인증한 후 확인 버튼을 클릭한다. |
| 3 | 시스템은 비밀번호 일치 여부와 CAPTCHA 성공 여부를 검증한다. |
| 4 | 검증 성공 시, 시스템은 '내 정보 관리' 페이지를 표시한다. 이 페이지에는 정보 변경, 로그인 이력 조회, 작성 글/댓글 조회, 약관 조회, 회원 탈퇴 등의 옵션이 포함된다. |
| 5 | 사용자는 ‘내 정보 관리’ 페이지의 옵션을 선택하여 아래 Extension scenarios에 따라 정보를 변경/조회할 수 있다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 비밀번호가 틀리거나 CAPTCHA 확인 실패 | 3a1. 시스템은 오류 메시지를 표시한다. / 3a2. Use case는 종료된다. |
| 5 | 5a. 사용자가 비밀번호 변경을 시도한다. | 5a1. 시스템은 Use case #18을 통해 인증을 요구한다. / 5a2. 인증이 성공하면 시스템은 비밀번호 변경 화면을 표시한다. / 5a3. 사용자는 비밀번호 입력란과 비밀번호 확인란에 새 비밀번호를 입력 후 완료 버튼을 클릭한다. / 5a4. 시스템은 비밀번호가 유효하면 사용자의 비밀번호를 변경하고 “비밀번호 변경 완료” 메시지를 표시 후 step 4로 이동한다. |
| 5 | 5b. 사용자가 닉네임 변경을 시도한다. | 5b1. 사용자는 입력란에 새 닉네임을 입력 후 확인 버튼을 클릭한다. / 5b2. 시스템은 닉네임의 중복 여부를 검사하여 중복이 없다면 사용자의 닉네임을 변경하고 “닉네임 변경 완료” 메시지를 표시 후 step 4로 이동한다. |
| 5 | 5d. 사용자가 회원 탈퇴를 시도한다. | 5d1. 시스템은 탈퇴 확인 메시지를 표시한다. / 5d2. 사용자가 탈퇴 버튼을 클릭하면 시스템은 해당 계정을 비활성화한다. / 5d3. 시스템은 사용자가 일정 기간 이내에 다시 로그인 하지 않으면 계정을 영구적으로 삭제한다. |
| 5 | 5e. 사용자가 로그인 이력 조회를 시도한다. | 5e1. 시스템은 데이터베이스에서 해당 사용자의 최근 로그인 기록을 조회하여 표시한다. |
| 5 | 5f. 사용자가 본인이 작성한 글의 조회를 시도한다. | 5f1. 게시글 검색 기능으로 이동하여 본인 닉네임을 검색하여 작성글을 검색한다. |
| 5 | 5g. 사용자가 본인이 작성한 댓글의 조회를 시도한다. | 5g1. 시스템은 데이터베이스에서 해당 사용자의 작성 댓글을 조회하여 표시한다. / 5g2. 사용자가 나가기 버튼을 클릭하면 step 4로 이동한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 5 seconds |
| Frequency | 사용자당 월 평균 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025. 11. 07. |

---

### Use case #18 : CAPTCHA
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 봇이 아닌 사람인지 확인하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | Subfunction level |
| Author | 박종선 |
| Last Update | 2025. 11. 04. |
| Status | Analysis (Finalize) |
| Primary Actor | 사용자 |
| Preconditions | 인증을 수행할 사용자의 계정이 시스템에 존재해야 한다. |
| Trigger | 다른 Use case에 의해서 발동 |
| Success Post Condition | 사용자가 사람임을 증명한다. |
| Failed Post Condition | 사용자가 사람임을 증명하지 못한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자에 대해 CAPTCHA가 요청된다. |
| 1 | 시스템은 행위 기반으로 백그라운드에서 사용자가 사람인지 봇인지 판단한다. |
| 2 | CAPTCHA가 성공하고 Use case는 종료된다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 1 | 2a. 사용자가 봇으로 판단됨 | 2a1. CAPTCHA가 실패하고 Use case는 종료된다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 3 seconds |
| Frequency | 사용자당 일 평균 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025. 11. 07. |

---

### Use case #19 : 댓글 생성
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 댓글을 생성하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | Subfunction level |
| Author | 허태규 |
| Last Update | 2025. 11. 06. |
| Status | Analysis (Finalize) |
| Primary Actor | register user |
| Preconditions | 댓글을 달려는 사용자는 로그인 상태여야 한다. |
| Trigger | 사용자가 ‘댓글 생성’ 버튼을 클릭하였을 때 |
| Success Post Condition | 댓글이 생성되고 데이터베이스에 삽입된다. |
| Failed Post Condition | 댓글이 생성되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 댓글 생성 혹은 수정을 위해, 텍스트 박스에 문자를 입력한다. |
| 1 | 이 Use case는 사용자가 게시글에 댓글을 생성 혹은 수정하고자 할 때 시작된다. |
| 2 | 사용자는 게시글 하단의 ‘댓글 생성’ 버튼을 클릭한다. |
| 3 | 시스템은 사용자가 입력한 텍스트가 적절한지 판단한다. |
| 4 | 사용자가 입력한 텍스트가 AI에게 프롬프트로 전달된다. |
| 5 | AI에 의해 생성된 댓글이 사용자에게 표시되고 데이터베이스에 반영된다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 사용자가 입력한 텍스트가 적절하지 않아 프롬프트로 전달되지 않는다. | 3a1. 사용자가 입력한 텍스트가 올바르지 않다는 메시지를 띄운다. / 3a2. 댓글 생성을 위한 텍스트를 입력하는 단계로 돌아간다. (Use case #20-2) |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 5 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #20 : 댓글 수정
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 이전 생성한 댓글을 수정하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 허태규 |
| Last Update | 2025. 11. 06. |
| Status | Analysis (Finalize) |
| Primary Actor | register user |
| Preconditions | 댓글을 수정하려는 사용자는 로그인 상태여야 한다. 사용자는 반드시 임의의 게시글을 조회 중인 상태여야 한다. 사용자가 생성한 댓글이 조회 중인 게시글에 존재해야 한다. |
| Trigger | 사용자가 자신의 댓글에 대해 ‘댓글 수정’ 버튼을 클릭하였을 때 |
| Success Post Condition | 사용자가 새로 입력한 프롬프트를 기반으로 새롭게 생성된 댓글이 수정 시간에 대한 타임스탬프가 추가되어 DB에 저장된다. 사용자가 수정한 댓글이 수정 시간 타임스탬프가 추가되어 화면에 즉시 표시된다. |
| Failed Post Condition | 사용자에게 적절한 실패 메시지를 띄운다. 시스템은 기존의 댓글의 정보 및 상태를 유지한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시한 임의의 댓글을 수정한다. |
| 1 | 이 Use case는 사용자가 자신이 게시한 댓글을 수정하고자 할 때 시작된다. |
| 2 | 사용자는 자신이 생성한 댓글에 대하여 ‘댓글 수정’ 버튼을 클릭한다. |
| 3 | 시스템은 사용자 입력을 바탕으로 댓글을 새롭게 생성한다. |
| 4 | 시스템이 생성한 댓글이 화면에 표시되면, 이 Use case는 끝난다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 시스템이 댓글 수정에 실패한다. | 3a1. 댓글 수정에 실패하였다는 메시지를 띄운다. / 3a2. 댓글 수정 버튼을 누르는 단계로 돌아간다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 10 seconds |
| Frequency | 사용자당 하루에 평균 2 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #21 : 댓글 삭제
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 이전 생성한 댓글을 삭제하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 허태규 |
| Last Update | 2025. 11. 06. |
| Status | Analysis (Finalize) |
| Primary Actor | register user |
| Preconditions | 댓글을 수정하려는 사용자는 로그인 상태여야 한다. 사용자는 반드시 임의의 게시글을 조회 중인 상태여야 한다. 사용자가 생성한 댓글이 조회 중인 게시글에 존재해야 한다. |
| Trigger | 사용자가 자신의 댓글에 대해 ‘댓글 삭제’ 버튼을 클릭하였을 때 |
| Success Post Condition | 사용자가 생성한 댓글이 시스템에 의해 DB에서 삭제된다. 사용자가 생성한 댓글이 시스템에서 즉시 표시되지 않는다. |
| Failed Post Condition | 사용자에게 적절한 실패 메시지를 띄운다. 시스템은 기존의 댓글의 정보 및 상태를 유지한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시한 임의의 댓글을 삭제한다. |
| 1 | 이 Use case는 사용자가 자신이 게시한 댓글을 삭제하고자 할 때 시작된다. |
| 2 | 사용자는 자신이 생성한 댓글에 대하여 ‘댓글 삭제’ 버튼을 클릭한다. |
| 3 | 시스템은 사용자의 댓글을 삭제한다. |
| 4 | 시스템이 댓글을 삭제하고, 그 결과가 화면에 표시되면, 이 Use case는 끝난다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 시스템이 댓글 삭제에 실패한다. | 3a1. 댓글 삭제에 실패하였다는 메시지를 띄운다. / 3a2. 댓글 삭제 버튼을 누르는 단계로 돌아간다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 5 seconds |
| Frequency | 사용자당 하루에 평균 2 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

## 3. Class diagram
이번 장은 시스템의 주요 클래스들과 그 관계를 보여주는 Class diagram을 제공한다. 전체 시스템 구조를 파악하기 위해 주요 도메인 및 서비스 클래스를 중심으로 설계하였다.  
![Class diagram](img/CD.png)

(Class Description 부분은 위에서 제공한 RAW 마크다운 내용을 여기에 삽입합니다.)
...
(중략)
...

---

## 4. Sequence diagram
이 장은 주요 Use case의 실행 흐름을 보여주는 Sequence diagram을 제공한다. 각 다이어그램은 특정 Use case description의 시나리오를 기반으로 객체 간의 상호작용을 시간 순서대로 묘사한다.

(Sequence Diagram 부분은 위에서 제공한 RAW 마크다운 내용을 여기에 삽입합니다.)
...
(중략)
...

---

## 5. State machine diagram
이 장은 시스템의 주요 객체와 사용자 인터페이스의 상태 변화를 보여주는 State machine diagram을 제공한다. 본 프로젝트는 클라이언트 사이드 렌더링(CSR) 기반의 SPA(Single Page Application) 구조를 가지므로, 클라이언트의 세션 상태(Guest/User)를 중심으로 상태 전이를 설계하였다.

(State Machine Diagram 부분은 위에서 제공한 RAW 마크다운 내용을 여기에 삽입합니다.)
...
(중략)
...

---

## 6. User interface prototype
![p.70](img/UI1.png)
위의 화면은 알림 상세 정보 화면이다. 사용자에게 전송된 알림을 볼 수 있는 Noti목록이 있다. Noti 목록에서는 알림의 제목, 날짜 등 간략한 알림 정보를 보여준다. Noti목록을 스크롤하며 확인하고 싶은 알림을 선택하면 아래에 알림의 세부사항을 확인할 수 있다. 알림 세부사항에서는 추가적으로 description을 볼 수 있다.  

![p.71](img/UI2.png)
위의 화면은 회원가입화면이다. 사용자는 사용할 id와 password를 입력하는 텍스트 칸이 있고, 자신이 봇이 아닌 인간임을 인증할 수 있는 captcha 버튼이 있다. 모든 양식을 채우고 register 버튼을 누르면 회원가입이 완료된다.  

![p.72](img/UI3.png)
위의 화면은 게시글 생성화면이다. 게시글 제목을 입력하는 텍스트 입력 칸이다. 아래에는 AI가 게시글 내용을 작성할 때 사용될 프롬프트 텍스트 입력 칸이다. 모든 양식을 입력하고 create Post 버튼을 누르면 최종적으로 게시글이 생성된다.  

![p.73](img/UI4.png)
위의 화면은 로그인 화면이다. 사용자는 id와 password를 입력할 수 있다. 아래에는 자신이 봇이 아닌 인간임을 인증할 수 있는 captcha 버튼이 있다. 모든 양식을 입력하고 Login 버튼을 누르면 입력한 정보를 토대로 Login 로직을 실행할 수 있다.  

![p.74](img/UI5.png)
위 그림은 게시판 화면이다. 상단의 게시판을 선택하여 위 화면을 열 수 있으며, 중앙에 해당 게시판이 열린다. 그 후 사용자는 게시판에 있는 게시글을 눌러 게시글을 열 수 있다. 1페이지에는 약 10개의 게시글이 표시되며, 하단의 번호나 화살표를 눌러 다음 페이지의 게시글을 확인 할 수 있다.  

![p.75](img/UI6.png)
위 그림은 게시글 화면이다. 사용자는 상단에서 글의 제목, 작성자의 닉네임, 작성일과 수정일, 좋아요와 싫어요의 수를 확인할 수 있으며, 중간에선 글의 내용을 확인할 수 있다. 하단에서는 이 게시글에 달린 댓글의 정보를 확인 할 수 있으며, 댓글이나 좋아요나 싫어요같은 평가도 남길 수 있다.  

![p.76](img/UI7.png)
위 그림은 홈 화면이다. 웹사이트에 접속하면 가장 먼저 보이는 화면으로 다른 화면을 연결한다. 웹사이트의 이름이나 로고를 확인할 수 있고, 로그인 화면이나 알림창 화면과 게시판 화면을 열 수 있다.  

![p.77](img/UI8.png)
위의 화면은 개인 정보화면이다. 사용자의 닉네임, 이메일, id를 확인할 수 있다. 아래에서 사용자가 작성한 게시글 목록과 사용자가 작성한 댓글 목록을 확인할 수 있다.  

![p.78](img/UI9.png)
이 게시판은 로그인 전과 로그인 후의 시각적 경험을 다르게 제공하여, 사용자가 작성한 프롬프트(prompt)를 기반으로 AI가 생성한 게시글임을 직관적으로 인지할 수 있도록 설계되었다. 로그인 시 화면이 즉시 컬러풀하게 변화하며 배경, 버튼, 텍스트 등에 색감이 추가되어 생동감 있는 UI로 전환된다. 
![p.79](img/UI10.png)  
![p.80](img/UI11.png)  
![p.81](img/UI12.png)  
![p.82](img/UI13.png)  
![p.83](img/UI14.png)  
![p.84](img/UI15.png)  
![p.85](img/UI16.png)

---

## 7. Implementation requirements
**H/W Platform Requirements** CPU: Intel Core Xeon E3 7세대 이상  
RAM: 64GB  
Storage: SSD 128GB 이상  
Network: 100Mbps 이상

**S/W Platform Requirements** OS: Windows 10/11, macOS, 또는 Linux  
Development Environment: Visual Studio Code (latest)  
Runtime / Framework: Node.js 20.x (npm 포함), Next.js Framework  
Version Control: Git

**Server Platform Requirements** Hosting Platform: Vercel (Next.js 기반 서버리스 환경)  
Database / Backend: Supabase (PostgreSQL 기반, Auth 및 Storage 포함)  
Implementation Languages: JavaScript (React, Node.js)  
Server OS: Ubuntu 20.04 LTS (Vercel 및 Supabase 내부 환경 기준)

**Non-functional Requirements** Scalability: 소규모 사용자(<100명/일) 기준 안정적 운영 가능  
Modularity: 프론트엔드와 백엔드 코드 분리  
Performance: 평균 응답시간 1초 이내

---

## 8. Glossary
| 이름 | 설명 |
|---|---|
| TTT | The Turing Test의 준말, 프로젝트의 이름 이자 로고이기도 하다. |
| 죽은 인터넷 이론 | 인터넷에 공급되는 각종 정보 및 콘텐츠 는 대부분 자동화 봇(AI)의 산물이며, 이용자 가운데 실제 사람의 참여나 노력으로 생산되는 것은 거의 없게 되었다(= 인터넷은 죽었다)는 가설 |
| 프롬프트 | LLM과 같은 언어 모델이나 모델 기반 AI 서비스, 생성 AI에 입력하는 입력값 |
| CAPTCHA | ‘Completely Automated Public Turing test to tell Computers and Humans Apart’의 준말. 웹사이트에서 사람이 접근하려고 하는 것인지 봇이 접근하는 것인지 판단하기 위하여 사용되는 튜링 테스트 |

---

## 9. References
[dead internet theory document in wikipidia]  
https://en.wikipedia.org/wiki/Dead_Internet_theory

[next.js official docs]  
https://nextjs.org/docs

[supabase official docs]  
https://supabase.com/docs\

[layerd architecture pattern explain]  
https://dev.to/yasmine_ddec94f4d4/understanding-the-layered-architecture-pattern-a-comprehensi ve-guide-1e2j

[common webarchitecture explain]  
https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-applic ation-architectures