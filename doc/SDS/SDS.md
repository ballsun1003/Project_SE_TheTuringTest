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
| 12/11/2025 | 2.0 | 완성된 SW에 맞추어 수정 | All team member |

---

## = Contents =
1. Introduction

2. Use case analysis

3. Class diagram

4. Sequence diagram

5. State machine diagram

6. User interface prototype

7. Implementation requirements

8. Glossary

9. References

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
- 주요 액터(Actor)는 사용자(User)와 관리자(Administrator)이다.
- **AI Model(OpenAI)**, **Database**, **CAPTCHA Service** 등은 외부 시스템으로서 Secondary Actor로 간주한다.

아래 그림은 본 프로젝트의 Use case diagram이다.  
![Use case diagram (p.6)](img/UD.png)

이번 장의 남은 부분은 주요 Use Case Description에 할당한다.

---

### Use case #1 : 게시글 검색
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 조건(제목, 내용, 작성자 등)에 따라 게시글을 검색하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김정우 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Preconditions | 사용자가 시스템에 접속해 있어야 한다. |
| Trigger | 사용자가 검색 아이콘을 클릭하거나 검색창에 진입할 때 |
| Success Post Condition | 검색 조건에 부합하는 게시글 목록이 화면에 표시된다. |
| Failed Post Condition | "검색 결과가 없습니다" 메시지가 표시되거나 목록이 갱신되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 검색 기능을 수행한다. |
| 1 | 사용자는 검색 필터(제목, 내용, 작성자, 댓글) 중 하나를 선택한다. |
| 2 | 사용자는 검색 창에 원하는 키워드를 입력하고 검색 버튼을 클릭한다. |
| 3 | 시스템은 **Database**에 쿼리를 전송하여 조건과 일치하는 게시글을 조회한다. |
| 4 | **Database**는 조회된 게시글 데이터를 시스템에 반환한다. |
| 5 | 시스템은 조회된 게시글 목록을 사용자에게 표시한다. |
| 6 | 사용자가 '다음' 버튼을 클릭하면 시스템은 추가 결과를 로드한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 4 | 4a. 검색 결과가 없을 때 | 4a1. 시스템은 "검색 결과가 없습니다."라는 메시지를 표시한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 5 seconds |
| Frequency | 사용자당 일 3회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #2 : 사용자 검색 (작성글 모아보기)
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 특정 사용자가 작성한 게시글과 댓글을 모아보는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김정우 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Preconditions | 게시글 목록 또는 상세 화면에 다른 사용자의 닉네임이 표시되어 있어야 한다. |
| Trigger | 사용자가 다른 사용자의 닉네임을 클릭할 때 |
| Success Post Condition | 해당 사용자의 활동 내역(작성글/댓글) 페이지로 이동한다. |
| Failed Post Condition | 활동 내역을 불러오지 못하고 오류 메시지가 표시된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 특정 사용자의 활동 내역을 조회한다. |
| 1 | 사용자는 게시글 상세 또는 목록 화면에서 특정 사용자의 닉네임을 클릭한다. |
| 2 | 시스템은 해당 사용자의 ID를 기반으로 **Database**에 작성 게시글 및 댓글을 요청한다. |
| 3 | **Database**는 해당 사용자의 활동 데이터를 반환한다. |
| 4 | 시스템은 조회된 활동 내역을 사용자 정보 페이지에 표시한다. |

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
| Summary | 사용자가 게시글에 대해 호감(좋아요) 또는 비호감(싫어요)을 표시하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김정우 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Preconditions | 사용자는 로그인 상태여야 한다. |
| Trigger | 사용자가 게시글 하단의 평가 아이콘(좋아요/싫어요)을 클릭할 때 |
| Success Post Condition | 게시글의 평가 수치가 갱신되고 UI에 반영된다. |
| Failed Post Condition | 평가 수치가 변경되지 않고 오류 메시지가 표시된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글에 대해 평가를 수행한다. |
| 1 | 사용자는 게시글 상세 화면에서 '좋아요' 또는 '싫어요' 버튼을 클릭한다. |
| 2 | 시스템은 **Database**를 조회하여 사용자의 기존 평가 여부를 확인한다. |
| 3 | 시스템은 평가 수치를 업데이트하여 **Database**에 저장한다. |
| 4 | 시스템은 변경된 평가 수치를 화면에 즉시 반영한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 2 | 2a. 이미 동일한 평가를 한 경우 | 2a1. 시스템은 **Database**에 평가 취소(삭제)를 요청하고 수치를 차감한다. |

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
| Summary | 사용자가 수신한 알림 내역을 확인하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Preconditions | 사용자는 로그인 상태여야 한다. |
| Trigger | 사용자가 헤더의 알림 아이콘을 클릭할 때 |
| Success Post Condition | 사용자가 수신 받은 알림 목록이 화면에 표시된다. |
| Failed Post Condition | 알림 목록을 불러오지 못한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 알림 목록을 조회한다. |
| 1 | 사용자가 상단 헤더의 알림 아이콘을 클릭한다. |
| 2 | 시스템은 **Database**에 해당 사용자에게 수신된 알림 목록 조회를 요청한다. |
| 3 | **Database**는 알림 데이터와 발신자 정보를 조인하여 반환한다. |
| 4 | 시스템은 알림 목록을 화면에 렌더링한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 데이터 반환 실패 | 3a1. "알림을 불러올 수 없습니다." 에러 메시지를 표시한다. |

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
| Summary | 특정 이벤트 발생 시 관련 사용자에게 알림을 생성 및 전송하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | Subfunction level |
| Author | 김은강 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | System |
| Secondary Actor | Database |
| Preconditions | 시스템이 이벤트를 감지할 수 있는 상태여야 한다. |
| Trigger | 게시글 평가, 댓글 작성 등의 이벤트 발생 시 |
| Success Post Condition | **Database**에 새로운 알림 레코드가 생성된다. |
| Failed Post Condition | 알림이 저장되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 시스템이 알림을 생성하고 전송한다. |
| 1 | 시스템은 게시글 평가 또는 댓글 작성 이벤트를 감지한다. |
| 2 | 시스템은 이벤트 발생자가 게시글 작성자 본인인지 확인한다. |
| 3 | 본인이 아닐 경우, 시스템은 알림 객체를 생성하여 **Database**에 저장을 요청한다. |

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
| Summary | 시스템 관리를 위해 관리자 권한으로 로그인하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | Administrator |
| Secondary Actor | Database, CAPTCHA Service |
| Preconditions | 관리자 계정이 사전에 생성되어 있어야 한다. |
| Trigger | 관리자 로그인 페이지에 접근할 때 |
| Success Post Condition | 관리자 권한 세션이 생성된다. |
| Failed Post Condition | 로그인이 거부된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 관리자가 시스템에 로그인을 시도한다. |
| 1 | 관리자는 아이디와 비밀번호를 입력하고 **CAPTCHA Service** 인증을 수행한다. |
| 2 | 관리자가 로그인 버튼을 클릭한다. |
| 3 | 시스템은 **Database**를 조회하여 관리자 계정 정보와 일치하는지 검증한다. |
| 4 | 검증 성공 시, 시스템은 관리자 권한을 부여하고 관리자 대시보드로 이동시킨다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 2 번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #7 : 사용자 정보 조회 (관리자)
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 관리자가 등록된 사용자의 상세 정보를 조회하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | Administrator |
| Secondary Actor | Database |
| Preconditions | 관리자로 로그인된 상태여야 한다. |
| Trigger | 관리자가 사용자 목록에서 사용자를 선택할 때 |
| Success Post Condition | 사용자 상세 정보가 화면에 표시된다. |
| Failed Post Condition | 정보를 불러오지 못한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 관리자가 특정 사용자의 정보를 조회한다. |
| 1 | 관리자가 사용자 목록 메뉴에서 특정 사용자를 선택한다. |
| 2 | 시스템은 **Database**에서 해당 사용자의 기본 정보 및 활동 로그를 조회한다. |
| 3 | 시스템은 조회된 정보를 관리자 화면에 상세히 표시한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 1번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #8 : 사용자 정보 수정 (관리자)
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 관리자가 사용자의 정보를 강제로 수정하거나 제재하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 김은강 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | Administrator |
| Secondary Actor | Database |
| Preconditions | 관리자로 로그인된 상태여야 한다. |
| Trigger | 관리자가 수정 버튼을 클릭할 때 |
| Success Post Condition | 사용자 정보가 **Database**에 갱신된다. |
| Failed Post Condition | 수정 사항이 반영되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 관리자가 사용자 정보를 수정한다. |
| 1 | 관리자가 사용자 상세 화면에서 '수정' 버튼을 클릭한다. |
| 2 | 관리자는 계정 상태(활성/정지) 등을 변경한다. |
| 3 | 관리자가 '저장' 버튼을 클릭하면 시스템은 **Database**에 변경 사항을 업데이트한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 2 seconds |
| Frequency | 회원당 하루에 평균 1번 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #9 : 게시글 작성 (AI 생성)
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자의 프롬프트를 기반으로 AI가 본문을 생성하여 게시글을 등록하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | AI Model (OpenAI API), Database |
| Preconditions | 사용자는 로그인 상태여야 한다. |
| Trigger | 사용자가 '게시글 생성' 버튼을 클릭할 때 |
| Success Post Condition | 게시글이 **Database**에 저장되고 목록에 등록된다. |
| Failed Post Condition | 게시글이 등록되지 않으며 오류 메시지가 표시된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글을 작성한다. |
| 1 | 사용자는 제목, 카테고리, 그리고 AI에게 전달할 프롬프트를 입력한다. |
| 2 | 사용자가 '게시글 생성' 버튼을 클릭한다. |
| 3 | 시스템은 입력된 프롬프트를 **AI Model**에 전송하여 텍스트 생성을 요청한다. |
| 4 | **AI Model**은 프롬프트를 분석하여 게시글 본문을 생성하고 시스템에 반환한다. |
| 5 | 시스템은 생성된 본문과 메타데이터를 **Database**에 저장한다. |
| 6 | 저장이 완료되면 시스템은 해당 게시글의 상세 페이지로 화면을 이동시킨다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 4 | 4a. AI 생성 실패 | 4a1. 시스템은 "AI 응답 시간이 초과되었습니다." 오류를 표시한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 3 seconds |
| Frequency | 사용자당 일 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #10 : 게시글 수정 (AI 재생성)
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 작성자가 수정 프롬프트를 입력하여 AI가 게시글 내용을 재작성하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | AI Model (OpenAI API), Database |
| Preconditions | 사용자는 해당 게시글의 작성자여야 한다. |
| Trigger | 사용자가 '수정 완료' 버튼을 클릭할 때 |
| Success Post Condition | 게시글 내용이 갱신되어 **Database**에 저장된다. |
| Failed Post Condition | 내용이 변경되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 수정을 시도한다. |
| 1 | 사용자는 게시글 상세 화면에서 '수정' 버튼을 클릭한다. |
| 2 | 사용자는 새로운 프롬프트를 입력하고 '수정 완료'를 클릭한다. |
| 3 | 시스템은 기존 본문과 새 프롬프트를 **AI Model**에 전송한다. |
| 4 | **AI Model**은 요청에 따라 본문을 재작성(Rewrite)하여 반환한다. |
| 5 | 시스템은 **Database**의 게시글 본문과 수정일시를 업데이트한다. |

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
| Summary | 작성자 또는 관리자가 게시글을 삭제(Soft Delete)하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Preconditions | 사용자는 작성자 본인이거나 관리자여야 한다. |
| Trigger | 사용자가 '삭제' 버튼을 클릭할 때 |
| Success Post Condition | **Database**에서 `is_deleted` 상태가 true로 변경된다. |
| Failed Post Condition | 게시글이 삭제되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 삭제를 시도한다. |
| 1 | 사용자가 게시글 상세 화면에서 '삭제' 버튼을 클릭한다. |
| 2 | 시스템은 권한을 검증한 후, **Database**에 삭제 요청(업데이트)을 보낸다. |
| 3 | **Database**는 해당 레코드의 상태를 삭제됨으로 변경한다. |
| 4 | 시스템은 게시글 목록 화면으로 이동시킨다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 1 seconds |
| Frequency | 사용자당 월 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #12 : 게시글 목록 조회
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 등록된 게시글을 최신순 또는 인기순으로 정렬하여 목록 형태로 보여주는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Preconditions | 사용자가 게시판 페이지에 접근해야 한다. |
| Success Post Condition | 게시글 목록이 정상적으로 표시된다. |
| Failed Post Condition | 목록을 불러오지 못한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 게시글 목록을 조회한다. |
| 1 | 사용자가 게시판 메뉴를 클릭하여 접근한다. |
| 2 | 시스템은 **Database**에서 게시글 목록을 최신순으로 조회한다. |
| 3 | **Database**는 게시글 데이터를 반환한다. |
| 4 | 시스템은 게시글 제목, 작성자, 좋아요 수 등을 목록 UI에 렌더링한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 1 seconds |
| Frequency | 사용자당 일 5회 |
| Concurrency | 제한 없음 |
| Due Date | 2025.11.07. |

---

### Use case #13 : 게시글 상세 조회
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 목록에서 선택된 게시글의 상세 내용을 확인하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 강승훈 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Preconditions | 게시글이 존재해야 한다. |
| Success Post Condition | 상세 내용이 표시되고 조회수가 증가한다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 특정 게시글을 상세 조회한다. |
| 1 | 사용자가 게시글 목록에서 특정 제목을 클릭한다. |
| 2 | 시스템은 **Database**에 해당 게시글의 상세 정보를 요청한다. |
| 3 | 시스템은 **Database**에 게시글의 조회수 증가(RPC)를 요청한다. |
| 4 | 시스템은 반환받은 상세 정보를 화면에 표시한다. |

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
| Summary | 사용자가 서비스 이용을 위해 새 계정을 생성하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 박종선 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database, CAPTCHA Service |
| Preconditions | 사용자가 비로그인 상태여야 한다. |
| Trigger | 사용자가 '가입하기' 버튼을 클릭할 때 |
| Success Post Condition | **Database**에 계정이 생성된다. |
| Failed Post Condition | 계정이 생성되지 않고 오류 메시지가 표시된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 회원가입을 시도한다. |
| 1 | 사용자는 이용약관 및 개인정보 수집에 동의한다. |
| 2 | 사용자는 **사용자 아이디(Username)**, 비밀번호, 닉네임을 입력한다. |
| 3 | 시스템은 **Database**를 조회하여 아이디와 닉네임 중복 여부를 검사한다. |
| 4 | 사용자는 **CAPTCHA Service**를 통해 봇 방지 인증을 수행한다. |
| 5 | 사용자가 '가입하기' 버튼을 클릭한다. |
| 6 | 시스템은 CAPTCHA 토큰을 검증하고, 성공 시 비밀번호를 해싱한다. |
| 7 | 시스템은 **Database**에 새로운 사용자 정보를 저장한다. |
| 8 | 시스템은 가입 성공 메시지를 표시하고 로그인 화면으로 이동한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 아이디 중복 | 3a1. "이미 존재하는 아이디입니다." 메시지를 표시한다. |
| 4 | 4a. CAPTCHA 실패 | 4a1. 인증 실패 메시지를 표시하고 재시도를 요청한다. |

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
| Summary | 등록된 계정으로 시스템에 인증을 요청하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 박종선 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database, CAPTCHA Service |
| Preconditions | 계정이 존재해야 한다. |
| Success Post Condition | Access Token이 발급되고 메인 화면으로 이동한다. |
| Failed Post Condition | 로그인이 실패하고 토큰이 발급되지 않는다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 로그인을 시도한다. |
| 1 | 사용자는 아이디와 비밀번호를 입력한다. |
| 2 | 사용자는 **CAPTCHA Service** 인증을 수행하고 '로그인' 버튼을 클릭한다. |
| 3 | 시스템은 **Database**를 조회하여 계정 존재 및 비밀번호 일치 여부를 검증한다. |
| 4 | 시스템은 해당 계정이 정지 상태인지 확인한다. |
| 5 | 검증 성공 시, 시스템은 Access Token을 발급하고 **Database**에 로그인 기록을 저장한다. |
| 6 | 시스템은 사용자를 메인 화면으로 이동시킨다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 3 | 3a. 정보 불일치 | 3a1. "아이디 또는 비밀번호를 확인해주세요." 메시지를 표시한다. |

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
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | None |
| Preconditions | 사용자가 로그인 상태여야 한다. |
| Success Post Condition | 클라이언트의 인증 토큰이 파기된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 로그아웃을 시도한다. |
| 1 | 사용자가 헤더의 '로그아웃' 버튼을 클릭한다. |
| 2 | 시스템(클라이언트)은 로컬 스토리지에 저장된 Access Token을 즉시 삭제한다. |
| 3 | 시스템은 사용자를 홈 화면으로 리다이렉트한다. |

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
| Summary | 사용자가 자신의 정보를 조회, 수정하거나 탈퇴하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 박종선 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database, CAPTCHA Service |
| Preconditions | 사용자는 로그인 상태여야 한다. |
| Success Post Condition | 정보 변경 사항이 **Database**에 반영된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 자신의 정보를 관리한다. |
| 1 | 사용자는 '내 정보 관리' 메뉴에 진입한다. |
| 2 | 시스템은 보안을 위해 비밀번호 재입력 및 **CAPTCHA Service** 인증을 요구한다. |
| 3 | 인증 성공 시, 시스템은 **Database**에서 조회한 사용자 정보를 표시한다. |
| 4 | 사용자는 정보 수정(닉네임/비밀번호), 작성 글 조회, 회원 탈퇴 등의 작업을 선택한다. |

**EXTENSION SCENARIOS**
| Step | Branching | Action |
|---|---|---|
| 4 | 4a. 회원 탈퇴 | 4a1. 사용자가 탈퇴 버튼을 클릭한다. <br> 4a2. 시스템은 **Database**에서 연관 데이터(글, 댓글)를 모두 삭제하고 계정을 파기한다. |

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
| Summary | 사용자가 봇이 아닌 사람임을 검증하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | Subfunction level |
| Author | 박종선 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | CAPTCHA Service (Turnstile) |
| Trigger | 회원가입, 로그인 등 보안이 필요한 작업 시 호출됨 |
| Success Post Condition | 유효한 검증 토큰이 발급된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자에 대한 봇 방지 인증을 수행한다. |
| 1 | 시스템은 **CAPTCHA Service** 위젯을 표시한다. |
| 2 | 사용자가 위젯을 클릭하거나 퍼즐을 푼다. |
| 3 | **CAPTCHA Service**는 검증 토큰을 발급한다. |
| 4 | 시스템은 이 토큰을 서버로 전송하여 최종 유효성을 확인한다. |

**RELATED INFORMATION**
| 구분 | 값 |
|---|---|
| Performance | ≤ 3 seconds |
| Frequency | 사용자당 일 평균 1회 |
| Concurrency | 제한 없음 |
| Due Date | 2025. 11. 07. |

---

### Use case #19 : 댓글 작성
**GENERAL CHARACTERISTICS**
| 항목 | 내용 |
|---|---|
| Summary | 사용자가 댓글 프롬프트를 입력하여 AI 댓글을 생성하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 허태규 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | AI Model (OpenAI API), Database |
| Preconditions | 사용자는 로그인 상태여야 한다. |
| Success Post Condition | 댓글이 **Database**에 저장되고 화면에 표시된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 댓글을 작성한다. |
| 1 | 사용자는 댓글 입력창에 1자 이상의 프롬프트를 입력한다. |
| 2 | 사용자가 '댓글 작성' 버튼을 클릭한다. |
| 3 | 시스템은 입력된 텍스트를 **AI Model**에게 전달하여 댓글 본문 생성을 요청한다. |
| 4 | **AI Model**은 생성된 텍스트를 반환한다. |
| 5 | 시스템은 생성된 댓글을 **Database**에 저장하고, 화면 목록에 추가한다. |

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
| Summary | 사용자가 자신이 작성한 댓글을 AI를 통해 재생성(수정)하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 허태규 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | AI Model, Database |
| Preconditions | 사용자는 해당 댓글의 작성자여야 한다. |
| Success Post Condition | 댓글 내용이 갱신되어 **Database**에 저장된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 자신의 댓글을 수정한다. |
| 1 | 사용자는 자신의 댓글 옆에 있는 '수정' 버튼을 클릭한다. |
| 2 | 사용자는 새로운 프롬프트를 입력하고 '수정 완료'를 클릭한다. |
| 3 | 시스템은 새 프롬프트로 **AI Model**에 댓글 재생성을 요청한다. |
| 4 | 시스템은 재생성된 댓글 내용을 **Database**에 업데이트한다. |

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
| Summary | 사용자가 자신이 작성한 댓글을 삭제하는 기능 |
| Scope | TTT (The Turing Test) |
| Level | User level |
| Author | 허태규 |
| Last Update | 2025. 12. 11. |
| Status | Finalize |
| Primary Actor | User |
| Secondary Actor | Database |
| Success Post Condition | 댓글 데이터가 **Database**에서 영구 삭제된다. |

**MAIN SUCCESS SCENARIO**
| Step | Action |
|---|---|
| S | 사용자가 자신의 댓글을 삭제한다. |
| 1 | 사용자는 자신의 댓글 옆에 있는 '삭제' 버튼을 클릭한다. |
| 2 | 시스템은 삭제 확인 팝업을 표시한다. |
| 3 | 사용자가 확인하면 시스템은 **Database**에서 해당 댓글 레코드를 삭제한다. |
| 4 | 댓글 목록이 갱신되어 삭제된 댓글이 화면에서 사라진다. |

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
## 6. User interface prototype
![p.70](img/UI1.png)
**Figure 1. 알림 목록 및 상세 화면.** 사용자에게 전송된 알림 목록을 보여준다. 목록에서는 제목과 날짜를 확인 가능하며, 선택 시 하단에 상세 설명이 표시된다.

![p.71](img/UI2.png)
**Figure 2. 회원가입 화면.** 사용자는 아이디(ID), 비밀번호, 닉네임을 입력하고 CAPTCHA 인증을 수행하여 계정을 생성할 수 있다.

![p.72](img/UI3.png)
**Figure 3. 게시글 작성 화면.** 상단에 제목을 입력하고, 하단에 AI 생성을 위한 프롬프트를 입력한다. 'Create Post' 버튼을 누르면 AI가 본문을 생성하여 게시한다.

![p.73](img/UI4.png)
**Figure 4. 로그인 화면.** 아이디와 비밀번호를 입력하고 CAPTCHA 인증을 거쳐 로그인을 수행한다.

![p.74](img/UI5.png)
**Figure 5. 게시판 목록 화면.** 카테고리별 게시글 목록을 카드 형태로 보여준다. 페이징 네비게이션을 통해 이전/다음 목록을 조회할 수 있다.

![p.75](img/UI6.png)
**Figure 6. 게시글 상세 화면.** 게시글의 제목, AI 생성 본문, 작성자 정보가 표시된다. 하단에서는 좋아요/싫어요 평가 및 댓글 작성/조회가 가능하다.

![p.76](img/UI7.png)
**Figure 7. 홈(랜딩) 화면.** 사이트 접속 시 최초로 보이는 화면으로, 주요 메뉴(게시판, 로그인 등)로의 진입점을 제공한다.

![p.77](img/UI8.png)
**Figure 8. 내 정보 관리 화면.** 사용자의 기본 정보(닉네임, 아이디)와 작성한 게시글/댓글 활동 로그를 탭 형태로 제공한다.

![p.78](img/UI9.png)
![p.79](img/UI10.png)  
![p.80](img/UI11.png)  
![p.81](img/UI12.png)  
![p.82](img/UI13.png)  
![p.83](img/UI14.png)  
![p.84](img/UI15.png)  
![p.85](img/UI16.png)
**Figure 9. UI 테마 전환 예시.** 로그인 전(흑백/건조함)과 로그인 후(컬러풀/생동감)의 시각적 차이를 통해 '죽은 인터넷'과 '인간의 등장'을 은유적으로 표현한다.


---

## 7. Implementation requirements
**H/W Platform Requirements**
CPU: Intel Core Xeon E3 7세대 이상  
RAM: 64GB  
Storage: SSD 128GB 이상  
Network: 100Mbps 이상

**S/W Platform Requirements**
OS: Windows 10/11, macOS, 또는 Linux  
Development Environment: Visual Studio Code (latest)  
Runtime / Framework: Node.js 20.x (npm 포함), Next.js Framework  
Version Control: Git

**Server Platform Requirements**
Hosting Platform: Docker 
Database: Supabase 
Implementation Languages: JavaScript (React, Node.js)  
Server OS: Linux

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
1. **Dead Internet theory** - Wikipedia. Available at: https://en.wikipedia.org/wiki/Dead_Internet_theory
2. **Next.js Documentation**. Available at: https://nextjs.org/docs
3. **Supabase Documentation**. Available at: https://supabase.com/docs
4. **Layered Architecture Pattern** - Dev.to. Available at: https://dev.to/yasmine_ddec94f4d4

5. **Common Web Application Architectures** - Microsoft Learn. Available at: https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/

