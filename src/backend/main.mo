import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Map "mo:core/Map";

actor {
  type Submission = {
    username : Text;
    timestamp : Time.Time;
  };

  let submissions = Map.empty<Principal, Submission>();

  public shared ({ caller }) func submitUsername(username : Text) : async () {
    let submission : Submission = {
      username;
      timestamp = Time.now();
    };
    submissions.add(caller, submission);
  };

  public query ({ caller }) func getAllSubmissions() : async [(Principal, Submission)] {
    submissions.toArray();
  };
};
