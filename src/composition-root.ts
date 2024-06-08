import {SecurityRepositories} from "./security/securityRepositories";
import {SecurityQueryRepositories} from "./security/securityQueryRepositories";
import {SecurityServices} from "./security/securityServices";
import {SecurityController} from "./security/securityController";

const securityRepositories = new SecurityRepositories();
const securityQueryRepositories = new SecurityQueryRepositories();
const securityServices = new SecurityServices(securityRepositories, securityQueryRepositories);
export const securityController = new SecurityController(securityServices)